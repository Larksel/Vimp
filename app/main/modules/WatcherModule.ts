import type Store from 'electron-store';
import { createMainLogger } from '@main/logger';
import { watch } from 'chokidar';
import path from 'path';
import { Config, Track } from '@shared/types/vimp';
import supportedExtensions from '@shared/constants/supportedExtensions';
import { IDBManager } from '@shared/interfaces/modules/IDBManager';
import { IMetadataModule } from '@shared/interfaces/modules/IMetadataModule';
import BaseModule from './BaseModule';
import { ITracksDatabase } from '@shared/interfaces/databases/ITracksDatabase';

const logger = createMainLogger('Watcher');

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
      .on('error', (error) => logger.error(`File watcher error: ${error}`))
      .on('ready', () => {
        logger.info('File watcher ready for changes.');
      });
  }

  private async handleAddedFile(filePath: string) {
    logger.info(`DETECTED: ${filePath}`);
    const resolvedPath = path.resolve(filePath);

    const existingDoc = await this.TracksDB.getByPath(resolvedPath);

    if (!existingDoc) {
      const track: Track = await this.metadataModule.getMetadata(resolvedPath);
      await this.TracksDB.create(track);
      logger.info(`ADDED: ${filePath}`);
    } else {
      logger.info(`SKIPPED: ${filePath}`);
    }
  }

  private async handleRemovedFile(filePath: string) {
    logger.info(`LOST: ${filePath}`);

    const resolvedPath = path.resolve(filePath);

    const existingDoc = await this.TracksDB.getByPath(resolvedPath);

    if (existingDoc) {
      await this.TracksDB.delete(existingDoc);
      logger.info(`REMOVED: ${filePath}`);
    } else {
      logger.info(`Track Not Found: ${filePath}`);
    }
  }
}
