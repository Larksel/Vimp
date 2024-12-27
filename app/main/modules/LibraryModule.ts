import { ipcMain } from 'electron';
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
import { FileTypes, ScannedFiles } from '@shared/types/vimp';

type FilterType = 'tracks' | 'video' | 'allSupported';

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

  constructor(dbManager: IDBManager, metadataModule: IMetadataModule) {
    super();

    this.dbManager = dbManager;
    this.metadataModule = metadataModule;

    this.status = {
      processed: 0,
      added: 0,
      total: 0,
    };
  }

  protected async load(): Promise<void> {
    ipcMain.handle(
      IPCChannels.LIBRARY_IMPORT,
      (_, pathsScan: string[]) => {
        return this.import(pathsScan);
      },
    );
    ipcMain.handle(IPCChannels.LIBRARY_SCAN, (_, paths: string[]) => {
      return this.scan(paths);
    });
  }

  /**
   * Scans passed paths and returns found files that are supported and folders.
   */
  async scan(
    pathsScan: string[],
  ): Promise<{ paths: string[]; files: string[] }> {
    console.log('Scanning:', pathsScan);

    const existingPaths = pathsScan.filter((folder) => fs.existsSync(folder));

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

    return {
      paths: folders,
      files: this.filterSupportedFiles(files, 'allSupported'),
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

      console.log('File scanning complete');
      this.resetImportProgress();

      return scannedFiles;
    } catch (error) {
      console.error('Error during import:', error);
      throw error;
    }
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
        console.log('video file filter needs implementation');
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
    const scanQueue = new queue();
    scanQueue.concurrency = 32;
    scanQueue.autostart = false;

    scanQueue.addEventListener('end', () => {
      console.log('Processing queue completed');
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
        console.warn(`No database found for file type: ${fileType}`);
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
      console.error('Error scanning file:', filePath, error);
    }
  }

  private resetImportProgress(): void {
    this.status.processed = 0;
    this.status.added = 0;
    this.status.total = 0;
  }

  private async insertScannedFiles(
    scannedFiles: ScannedFiles,
  ): Promise<void> {
    for (const [fileType, files] of Object.entries(scannedFiles)) {
      const db = this.getDatabaseForType(fileType as FileTypes);
      if (db && files.length > 0) {
        console.log(
          `Inserting ${files.length} ${fileType} files into database`,
        );
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
        console.log('No DB for videos');
        return null;
      default:
        return null;
    }
  }
}
