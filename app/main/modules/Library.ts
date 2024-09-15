import { IpcMainInvokeEvent, ipcMain } from 'electron';
import { globby } from 'globby';
import fs from 'fs';
import path from 'path';
import queue from 'queue';

import globals from '@shared/constants/globals';
import channels from '@shared/constants/ipc-channels';
import { Track } from '@shared/types/vimp';

import Module from './BaseModule';
import { TracksDB } from '@main/db';
import { getMetadata } from './Metadata';

class Library extends Module {
  public import: {
    processed: number;
    total: number;
  };

  constructor() {
    super();

    this.import = {
      processed: 0,
      total: 0,
    };
  }

  async load(): Promise<void> {
    ipcMain.handle(
      channels.LIBRARY_IMPORT_TRACKS,
      this.importTracks.bind(this),
    );
    ipcMain.handle(channels.LIBRARY_SCAN_TRACKS, this.scanTracks.bind(this));
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

              const existingDoc = await TracksDB.getByPath(filePath);

              if (!existingDoc) {
                const track = await getMetadata(filePath);
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
        await TracksDB.insertMany(scannedFiles);
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default Library;
