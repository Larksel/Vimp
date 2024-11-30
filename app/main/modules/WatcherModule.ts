import type Store from 'electron-store';
import { watch } from 'chokidar';
import path from 'path';
import { Config, Track } from '@shared/types/vimp';
import supportedExtensions from '@shared/constants/supportedExtensions';
import { IDBManager } from '@interfaces/modules/IDBManager';
import { IMetadataModule } from '@interfaces/modules/IMetadataModule';
import BaseModule from './BaseModule';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';

export default class WatcherModule extends BaseModule {
  protected config: Store<Config>;
  private readonly metadataModule: IMetadataModule;
  private readonly TracksDB: ITracksDatabase;

  constructor(
    dbManager: IDBManager,
    config: Store<Config>,
    metadataModule: IMetadataModule,
  ) {
    super();

    this.TracksDB = dbManager.getTracksDB();
    this.metadataModule = metadataModule;
    this.config = config;
  }

  protected async load() {
    const lookahead = supportedExtensions.TRACKS.map(
      (ext) => ext.slice(1) + '$',
    ).join('|'); // Prepara as extensões para o regex
    const watcher = watch(this.config.get('musicFolders'), {
      persistent: true,
      awaitWriteFinish: true,
      ignoreInitial: true,
      ignored: new RegExp(`^[^.]*\\.(?!${lookahead})[^.]*$`, 'i'),
    });

    watcher
      .on('add', (path) => this.handleAddedFile(path))
      .on('unlink', (path) => this.handleRemovedFile(path))
      .on('error', (error) => console.log(`Watcher error: ${error}`))
      .on('ready', () => {
        console.log('Initial scan complete. Ready for changes.');
      });
  }

  private async handleAddedFile(filePath: string) {
    console.log(`DETECTED: ${filePath}`);
    const resolvedPath = path.resolve(filePath);

    const existingDoc = await this.TracksDB.getByPath(resolvedPath);

    if (!existingDoc) {
      const track: Track = await this.metadataModule.getMetadata(resolvedPath);
      await this.TracksDB.create(track);
      console.log(`ADDED: ${filePath}`);
    } else {
      console.log(`SKIPPED: ${filePath}`);
    }
  }

  private async handleRemovedFile(filePath: string) {
    console.log(`LOST: ${filePath}`);

    const resolvedPath = path.resolve(filePath);

    const existingDoc = await this.TracksDB.getByPath(resolvedPath);

    if (existingDoc) {
      await this.TracksDB.delete(existingDoc);
      console.log(`REMOVED: ${filePath}`);
    } else {
      console.log(`Track Not Found: ${filePath}`);
    }
  }
}
