import { ipcMain } from 'electron';
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';
import queue from 'queue';

import globals from '@shared/constants/globals';
import IPCChannels from '@shared/constants/IPCChannels';

import BaseModule from './BaseModule';
import { IMetadataModule } from '@interfaces/modules/IMetadataModule';
import { IDBManager } from '@interfaces/modules/IDBManager';
import { ILibraryModule } from '@interfaces/modules/InewLibraryModule';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';

type FilterType = 'tracks' | 'video';

export default class LibraryModule
  extends BaseModule
  implements ILibraryModule
{
  public status: {
    processed: number;
    total: number;
  };

  private readonly metadataModule: IMetadataModule;
  private readonly TracksDB: ITracksDatabase;

  constructor(dbManager: IDBManager, metadataModule: IMetadataModule) {
    super();

    this.TracksDB = dbManager.getTracksDB();
    this.metadataModule = metadataModule;

    this.status = {
      processed: 0,
      total: 0,
    };
  }

  protected async load(): Promise<void> {
    ipcMain.handle(
      IPCChannels.LIBRARY_IMPORT_TRACKS,
      (_, pathsScan: string[]) => {
        return this.import(pathsScan);
      },
    ); //TODO alterar canais
    ipcMain.handle(IPCChannels.LIBRARY_SCAN_TRACKS, (_, paths: string[]) => {
      return this.scan(paths);
    }); //TODO alterar canais
  }

  // TODO retornar ja organizado em grupos (musica, video, playlist)
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

    return { paths: folders, files: files };
  }

  async import<T>(itemsPath: string[]): Promise<T[]> {
    return [{}] as T[];
  }

  private filterSupportedFiles(files: string[], type: FilterType) {
    let supportedExtensions: string[];
    switch (type) {
      case 'tracks':
        supportedExtensions = globals.SUPPORTED_TRACKS_EXTENSIONS;
        break;

      case 'video':
        console.log('video file filter needs implementation');
        break;

      default:
        break;
    }

    const supportedFiles = files.filter((filePath) => {
      const extension = path.extname(filePath).toLowerCase();
      return supportedExtensions.includes(extension);
    });

    return supportedFiles;
  }
}
