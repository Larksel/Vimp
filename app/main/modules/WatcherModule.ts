import type Store from 'electron-store';
import { createMainLogger } from '@main/logger';
import { watch } from 'chokidar';
import path from 'path';
import { Config, Track } from '@shared/types/vimp';
import supportedExtensions from '@shared/constants/supportedExtensions';
import { IMetadataModule } from '@shared/interfaces/modules/IMetadataModule';
import BaseModule from './BaseModule';
import { VimpServices } from '@main/services';

const logger = createMainLogger('Watcher');

export default class WatcherModule extends BaseModule {
  protected config: Store<Config>;
  private readonly metadataModule: IMetadataModule;
  private readonly mediaService: VimpServices['mediaService'];

  constructor(
    services: VimpServices,
    config: Store<Config>,
    metadataModule: IMetadataModule,
  ) {
    super();

    this.mediaService = services.mediaService;
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

    const existingTrack = this.mediaService.getByPath(resolvedPath);

    if (!existingTrack) {
      const track: Track = await this.metadataModule.getMetadata(resolvedPath);
      this.mediaService.importTrack(track);
      logger.info(`ADDED: ${filePath}`);
    } else {
      logger.info(`SKIPPED: ${filePath}`);
    }
  }

  private async handleRemovedFile(filePath: string) {
    logger.info(`LOST: ${filePath}`);

    const resolvedPath = path.resolve(filePath);

    const existingTrack = this.mediaService.getByPath(resolvedPath);

    if (existingTrack) {
      this.mediaService.deleteByPath(resolvedPath);
      logger.info(`REMOVED: ${filePath}`);
    } else {
      logger.info(`Track Not Found: ${filePath}`);
    }
  }
}
