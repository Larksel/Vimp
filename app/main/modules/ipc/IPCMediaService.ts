import { ipcMain, BrowserWindow } from 'electron';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track } from '@shared/types/vimp';
import { VimpServices } from '@main/services';
import { InsertMedia } from '@main/types';

export default class IPCMediaService extends BaseWindowModule {
  private readonly mediaService: VimpServices['mediaService'];

  constructor(window: BrowserWindow, services: VimpServices) {
    super(window);
    this.mediaService = services.mediaService;
  }

  protected async load() {
    ipcMain.handle(
      IPCChannels.MEDIA_GET_ALL,
      async (_, type?: 'audio' | 'video') => {
        return this.mediaService.getAll(type);
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_GET_BY_ID, async (_, id: number) => {
      return this.mediaService.getById(id);
    });

    ipcMain.handle(
      IPCChannels.MEDIA_GET_BY_PATH,
      async (_, mediaPath: string) => {
        return this.mediaService.getByPath(mediaPath);
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_CREATE, async (_, media: InsertMedia) => {
      const result = this.mediaService.insert(media);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.MEDIA_UPDATE,
      async (_, id: number, media: Partial<InsertMedia>) => {
        const result = this.mediaService.update(id, media);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.MEDIA_DELETE_BY_ID, async (_, id: number) => {
      const result = this.mediaService.deleteById(id);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(IPCChannels.MEDIA_IMPORT_TRACK, async (_, track: Track) => {
      const result = this.mediaService.insertTrack(track);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.MEDIA_IMPORT_TRACKS,
      async (_, tracks: Track[]) => {
        const result = this.mediaService.insertManyTracks(tracks);
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
