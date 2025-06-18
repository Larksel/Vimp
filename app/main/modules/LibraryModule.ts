import { ipcMain } from 'electron';
import { createMainLogger } from '@main/logger';
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';
import queue from 'queue';

import supportedExtensions from '@shared/constants/supportedExtensions';
import IPCChannels from '@shared/constants/IPCChannels';

import BaseModule from './BaseModule';
import { IMetadataModule } from '@interfaces/modules/IMetadataModule';
import { IDBManager } from '@interfaces/modules/IDBManager';
import { ILibraryModule } from '@interfaces/modules/ILibraryModule';
import type Store from 'electron-store';
import { Config, FileTypes, ScannedFiles } from '@shared/types/vimp';

type FilterType = 'tracks' | 'video' | 'allSupported';

const logger = createMainLogger('Library');

export default class LibraryModule
  extends BaseModule
  implements ILibraryModule
{
  public status: {
    processed: number;
    added: number;
    total: number;
  };

  private readonly metadataModule: IMetadataModule;
  private readonly dbManager: IDBManager;
  protected config: Store<Config>;

  constructor(
    dbManager: IDBManager,
    metadataModule: IMetadataModule,
    config: Store<Config>,
  ) {
    super();

    this.dbManager = dbManager;
    this.metadataModule = metadataModule;
    this.config = config;
    this.status = {
      processed: 0,
      added: 0,
      total: 0,
    };
  }

  protected async load(): Promise<void> {
    logger.info('Starting initial library scan');
    await this.scanAndSave();
    ipcMain.handle(IPCChannels.LIBRARY_IMPORT, (_, pathsScan: string[]) => {
      return this.import(pathsScan);
    });
    ipcMain.handle(IPCChannels.LIBRARY_SCAN, (_, paths: string[]) => {
      return this.scan(paths);
    });
    ipcMain.handle(IPCChannels.LIBRARY_SCAN_AND_SAVE, (_, paths?: string[]) => {
      return this.scanAndSave(paths);
    });
  }

  /**
   * Scans passed paths and returns found files that are supported and folders.
   */
  async scan(
    pathsScan: string[],
  ): Promise<{ folders: string[]; files: string[] }> {
    const existingPaths = pathsScan.filter((folder) => fs.existsSync(folder));

    if (existingPaths.length === 0) {
      logger.error('The passed paths dont exist');
      return { folders: [], files: [] };
    }

    logger.info(`Scanning: ${existingPaths.join(', ')}`);

    const pathsStats = await Promise.all(
      existingPaths.map(async (folder) => ({
        path: folder,
        stat: await fs.promises.stat(folder),
      })),
    );

    const files: string[] = [];
    const folders: string[] = [];

    pathsStats.forEach(({ path, stat }) => {
      if (stat.isFile()) files.push(path);
      if (stat.isDirectory() || stat.isSymbolicLink()) folders.push(path);
    });

    const subDirPatterns = folders.map((folder) => {
      return `${folder
        .replace(/\\/g, '/')
        .replace(/([$^*+?()[\]])/g, '\\$1')}/**/*`;
    });

    const subDirectoryContents = await Promise.all(
      subDirPatterns.map((pattern) =>
        globby(pattern, { followSymbolicLinks: true, onlyFiles: false }),
      ),
    );

    subDirectoryContents.flat().forEach((item) => {
      const itemStat = fs.statSync(item);
      if (itemStat.isFile()) files.push(item);
      if (itemStat.isDirectory()) folders.push(item);
    });

    const supportedFiles = this.filterSupportedFiles(files, 'allSupported');

    logger.info(`Found ${folders.length} folders`);
    logger.info(`Found ${supportedFiles.length} supported files`);

    return {
      folders: folders,
      files: supportedFiles,
    };
  }

  /**
   * Imports files from passed paths to the database
   */
  async import(itemsPath: string[]) {
    if (!itemsPath || itemsPath.length === 0) return null;

    // Filtrar caminhos válidos
    const validPaths = itemsPath.filter((path) => path);
    if (validPaths.length === 0) return null;

    logger.info('Initializing import');

    const scannedFiles: ScannedFiles = {
      tracks: [],
      //videos: [],
    };

    try {
      // Configurar a fila de processamento
      const scanQueue = this.createScanQueue();

      this.status.total += validPaths.length;

      validPaths.forEach((filePath) => {
        scanQueue.push(() => this.processFile(filePath, scannedFiles));
      });

      // Iniciar a fila de processamento
      await scanQueue.start();
      await this.insertScannedFiles(scannedFiles);

      logger.info('Import completed');
      logger.info(
        `Processed ${this.status.processed}/${this.status.total} files`,
      );
      logger.info(`Added ${this.status.added} files to database`);
      this.resetImportProgress();

      return scannedFiles;
    } catch (error) {
      logger.error(`Error during import: ${error}`);
      throw error;
    }
  }

  /**
   * Scans the specified paths and configured music folders for supported media files,
   * imports the found files into the database, and returns the imported file data.
   *
   * @param paths - An optional array of paths to scan in addition to the configured music folders.
   * @returns A promise that resolves to the imported file data or null if no files are found.
   */

  async scanAndSave(paths: string[] = []) {
    const pathsScan = [...paths, ...this.config.get('musicFolders')];
    const { files } = await this.scan(pathsScan);
    const importedFiles = await this.import(files);

    return importedFiles;
  }

  private filterSupportedFiles(files: string[], type: FilterType) {
    let extensions: string[] = [];
    const fileTypes = Object.keys(supportedExtensions);

    switch (type) {
      case 'tracks':
        extensions = supportedExtensions.TRACKS;
        break;

      case 'video':
        extensions = supportedExtensions.VIDEOS;
        logger.error('video file filter needs implementation');
        break;

      case 'allSupported':
        extensions = fileTypes
          .map((fileType) => supportedExtensions[fileType])
          .flat()
          .filter((value, index, self) => self.indexOf(value) === index);
        break;

      default:
        break;
    }

    const supportedFiles = files.filter((filePath) => {
      const extension = path.extname(filePath).toLowerCase();
      return extensions.includes(extension);
    });

    return supportedFiles;
  }

  private createScanQueue() {
    logger.info('Processing queue created');
    const scanQueue = new queue();
    scanQueue.concurrency = 32;
    scanQueue.autostart = false;

    scanQueue.addEventListener('end', () => {
      logger.info('Processing queue completed');
    });

    return scanQueue;
  }

  private async processFile(
    filePath: string,
    scannedFiles: ScannedFiles,
  ): Promise<void> {
    try {
      const resolvedPath = path.resolve(filePath);
      const extension = path.extname(resolvedPath).toLowerCase();

      const fileType = this.getFileType(extension);
      const db = this.getDatabaseForType(fileType);

      if (!db) {
        logger.error(`No database found for file type: ${fileType}`);
        return;
      }

      const existingDoc = await db.getByPath(resolvedPath);

      if (!existingDoc) {
        const metadata = await this.metadataModule.getMetadata(resolvedPath);
        if (!scannedFiles[fileType]) scannedFiles[fileType] = [];
        scannedFiles[fileType].push(metadata);
        this.status.added++;
      }

      this.status.processed++;
    } catch (error) {
      logger.error(`Error scanning file: ${filePath} \n${error}`);
    }
  }

  private resetImportProgress(): void {
    this.status.processed = 0;
    this.status.added = 0;
    this.status.total = 0;
  }

  private async insertScannedFiles(scannedFiles: ScannedFiles): Promise<void> {
    for (const [fileType, files] of Object.entries(scannedFiles)) {
      const db = this.getDatabaseForType(fileType as FileTypes);
      if (db && files.length > 0) {
        logger.info(`Inserting ${files.length} ${fileType} into database`);
        await db.create(files);
      }
    }
  }

  private getFileType(extension: string): FileTypes {
    // Check for video formats first to avoid mistakenly importing videos as audio,
    // especially when both share supported formats like mp4 and webm.
    if (supportedExtensions.VIDEOS.includes(extension)) return FileTypes.VIDEOS;
    if (supportedExtensions.TRACKS.includes(extension)) return FileTypes.TRACKS;
    return FileTypes.UNKNOWN;
  }

  private getDatabaseForType(fileType: FileTypes) {
    switch (fileType) {
      case FileTypes.TRACKS:
        return this.dbManager.getTracksDB();
      case FileTypes.VIDEOS:
        logger.error('No DB for videos');
        return null;
      default:
        return null;
    }
  }
}
