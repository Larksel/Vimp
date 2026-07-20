import { ipcMain, BrowserWindow } from 'electron';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { VimpServices } from '@main/services';
import { InsertPlaylist } from '@main/types';

export default class IPCPlaylistService extends BaseWindowModule {
  private readonly playlistService: VimpServices['playlistService'];

  constructor(window: BrowserWindow, services: VimpServices) {
    super(window);
    this.playlistService = services.playlistService;
  }

  protected async load() {
    ipcMain.handle(IPCChannels.PLAYLIST_GET_ALL, async () => {
      return this.playlistService.getAll();
    });

    ipcMain.handle(IPCChannels.PLAYLIST_GET_BY_ID, async (_, id: number) => {
      return this.playlistService.getById(id);
    });

    ipcMain.handle(
      IPCChannels.PLAYLIST_GET_BY_SLUG,
      async (_, slug: string) => {
        return this.playlistService.getBySlug(slug);
      },
    );

    ipcMain.handle(IPCChannels.PLAYLIST_GET_ITEMS, async (_, id: number) => {
      return this.playlistService.getItems(id);
    });

    ipcMain.handle(
      IPCChannels.PLAYLIST_CREATE,
      async (_, playlist: InsertPlaylist) => {
        const result = this.playlistService.insert(playlist);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLIST_UPDATE,
      async (_, id: number, playlist: Partial<InsertPlaylist>) => {
        const result = this.playlistService.update(id, playlist);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.PLAYLIST_DELETE_BY_ID, async (_, id: number) => {
      const result = this.playlistService.deleteById(id);
      this.emitChanged();
      return result;
    });

    ipcMain.handle(
      IPCChannels.PLAYLIST_ADD_MEDIA,
      async (_, playlistId: number, mediaId: number, position?: number) => {
        const result = this.playlistService.addMediaToPlaylist(
          playlistId,
          mediaId,
          position,
        );
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLIST_REMOVE_MEDIA,
      async (_, playlistId: number, mediaId: number) => {
        const result = this.playlistService.removeMediaFromPlaylist(
          playlistId,
          mediaId,
        );
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLIST_MOVE_ITEM,
      async (_, itemId: number, position: number) => {
        const result = this.playlistService.movePlaylistItem(itemId, position);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.PLAYLIST_CLEANUP_MISSING, async () => {
      const result = this.playlistService.removeMissingMediaFromPlaylists();
      this.emitChanged();
      return result;
    });
  }

  private emitChanged() {
    this.window.webContents.send(IPCChannels.PLAYLIST_HAS_CHANGED);
  }
}
