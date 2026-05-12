import { ipcMain, BrowserWindow } from 'electron';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track } from '@shared/types/vimp';
import { VimpServices } from '@main/services';
import createMediaRepository from '@main/db/repositories/mediaRepository';
import { InsertMedia } from '@main/types';

type MediaRepository = ReturnType<typeof createMediaRepository>;

export default class IPCMediaService extends BaseWindowModule {
  private readonly mediaService: VimpServices['mediaService'];
  private readonly mediaRepository: MediaRepository;

  constructor(
    window: BrowserWindow,
    services: VimpServices,
    mediaRepository: MediaRepository,
  ) {
    super(window);
    this.mediaService = services.mediaService;
    this.mediaRepository = mediaRepository;
  }

  protected async load() {
    ipcMain.handle(
      IPCChannels.MEDIA_GET_ALL,
      async (_, type?: 'audio' | 'video') => {
        return this.mediaRepository.getAll(type);
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_GET_BY_ID, async (_, id: number) => {
      return this.mediaRepository.getById(id);
    });

    ipcMain.handle(
      IPCChannels.MEDIA_GET_BY_PATH,
      async (_, mediaPath: string) => {
        return this.mediaRepository.getByPath(mediaPath);
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_CREATE, async (_, media: InsertMedia) => {
      const result = this.mediaRepository.insert(media);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.MEDIA_UPDATE,
      async (_, id: number, media: Partial<InsertMedia>) => {
        const result = this.mediaRepository.update(id, media);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_DELETE_BY_ID, async (_, id: number) => {
      const result = this.mediaRepository.deleteById(id);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(IPCChannels.MEDIA_IMPORT_TRACK, async (_, track: Track) => {
      const result = this.mediaService.importTrack(track);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.MEDIA_IMPORT_TRACKS,
      async (_, tracks: Track[]) => {
        const result = this.mediaService.importTracks(tracks);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_SCAN_MISSING, async () => {
      const result = this.mediaService.scanMissingMedia();
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.MEDIA_RECORD_AUDIO_PLAYBACK,
      async (_, mediaId: number) => {
        const result = this.mediaService.recordAudioPlayback(mediaId);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(
      IPCChannels.MEDIA_DELETE_BY_PATH,
      async (_, mediaPath: string) => {
        const result = this.mediaService.deleteByPath(mediaPath);
        this.emitChanged();
        return result;
      },
    );
  }

  private emitChanged() {
    this.window.webContents.send(IPCChannels.MEDIA_HAS_CHANGED);
  }
}
