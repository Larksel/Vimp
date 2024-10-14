import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';
import queue from 'queue';

import globals from '@shared/constants/globals';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track } from '@shared/types/vimp';

import BaseModule from './BaseModule';
import { IMetadataModule } from '@interfaces/modules/IMetadataModule';
import { IDBManager } from '@interfaces/modules/IDBManager';
import { ILibraryModule } from '@interfaces/modules/ILibraryModule';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';

export default class LibraryModule extends BaseModule implements ILibraryModule {
  public import: {
    processed: number;
    total: number;
  };

  private readonly metadataModule: IMetadataModule;
  private readonly TracksDB: ITracksDatabase;

  constructor(dbManager: IDBManager, metadataModule: IMetadataModule) {
    super();

    this.TracksDB = dbManager.getTracksDB();
    this.metadataModule = metadataModule;

    this.import = {
      processed: 0,
      total: 0,
    };
  }

  protected async load(): Promise<void> {
    ipcMain.handle(
      IPCChannels.LIBRARY_IMPORT_TRACKS,
      this.importTracks.bind(this),
    );
    ipcMain.handle(IPCChannels.LIBRARY_SCAN_TRACKS, this.scanTracks.bind(this));
  }

  private async scanTracks(
    _: IpcMainInvokeEvent,
    pathsScan: string[],
  ): Promise<string[]> {
    console.log('Scanning:', pathsScan);

    const existingPaths = pathsScan.filter(
      (folder) => fs.existsSync(folder) === true,
    );

    const paths = await Promise.all(
      existingPaths.map(async (folder) => ({
        path: folder,
        stat: await fs.promises.stat(folder),
      })),
    );

    const files: string[] = [];
    const folders: string[] = [];

    paths.forEach((elem) => {
      if (elem.stat.isFile()) files.push(elem.path);
      if (elem.stat.isDirectory() || elem.stat.isSymbolicLink())
        folders.push(elem.path);
    });

    const globbies = folders.map((folder) => {
      const pattern = `${folder
        .replace(/\\/g, '/')
        .replace(/([$^*+?()\[\]])/g, '\\$1')}/**/*.*`;

      return globby(pattern, { followSymbolicLinks: true });
    });

    const subDirectoriesFiles = await Promise.all(globbies);

    const allFiles = subDirectoriesFiles
      .reduce((acc, array) => acc.concat(array), [] as string[])
      .concat(files);

    const supportedTrackFiles = allFiles.filter((filePath) => {
      const extension = path.extname(filePath).toLowerCase();
      return globals.SUPPORTED_TRACKS_EXTENSIONS.includes(extension);
    });

    return supportedTrackFiles;
  }

  async importTracks(
    _: IpcMainInvokeEvent,
    tracksPath: string[],
  ): Promise<Track[]> {
    console.log(`Importing ${tracksPath.length} tracks`);

    return new Promise(async (resolve, reject) => {
      if (tracksPath.length === 0) return;

      try {
        const scannedFiles: Track[] = [];

        const scanQueue = new queue();
        scanQueue.concurrency = 32;
        scanQueue.autostart = false;

        scanQueue.addEventListener('end', () => {
          this.import.processed = 0;
          this.import.total = 0;

          console.log('File scanning complete');
          resolve(scannedFiles);
        });

        this.import.total += tracksPath.length;

        tracksPath.forEach((filePath) => {
          scanQueue.push(async (callback) => {
            try {
              filePath = path.resolve(filePath);

              const existingDoc = await this.TracksDB.getByPath(filePath);

              if (!existingDoc) {
                const track = await this.metadataModule.getMetadata(filePath);
                scannedFiles.push(track);
              }

              this.import.processed++;
            } catch (err) {
              console.log('Error scaning', filePath);
            }

            if (callback) callback();
          });
        });

        await scanQueue.start();

        console.log('Inserting in database');
        await this.TracksDB.insertMany(scannedFiles);
      } catch (err) {
        reject(err);
      }
    });
  }
}
