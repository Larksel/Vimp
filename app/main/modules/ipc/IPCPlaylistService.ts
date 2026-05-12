import { ipcMain, BrowserWindow } from 'electron';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import IPCChannels from '@shared/constants/IPCChannels';
import { VimpServices } from '@main/services';
import { InsertPlaylist } from '@main/types';
import createPlaylistRepository from '@main/db/repositories/playlistRepository';

type PlaylistRepository = ReturnType<typeof createPlaylistRepository>;

export default class IPCPlaylistService extends BaseWindowModule {
  private readonly playlistService: VimpServices['playlistService'];
  private readonly playlistRepository: PlaylistRepository;

  constructor(
    window: BrowserWindow,
    services: VimpServices,
    playlistRepository: PlaylistRepository,
  ) {
    super(window);
    this.playlistService = services.playlistService;
    this.playlistRepository = playlistRepository;
  }

  protected async load() {
    ipcMain.handle(IPCChannels.PLAYLIST_GET_ALL, async () => {
      return this.playlistRepository.getAll();
    });

    ipcMain.handle(IPCChannels.PLAYLIST_GET_BY_ID, async (_, id: number) => {
      return this.playlistRepository.getById(id);
    });

    ipcMain.handle(
      IPCChannels.PLAYLIST_GET_BY_SLUG,
      async (_, slug: string) => {
        return this.playlistRepository.getBySlug(slug);
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLIST_CREATE,
      async (_, playlist: InsertPlaylist) => {
        const result = this.playlistRepository.insert(playlist);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLIST_UPDATE,
      async (_, id: number, playlist: Partial<InsertPlaylist>) => {
        const result = this.playlistRepository.update(id, playlist);
        this.emitChanged();
        return result;
      },
    );

    ipcMain.handle(IPCChannels.PLAYLIST_DELETE_BY_ID, async (_, id: number) => {
      const result = this.playlistRepository.deleteById(id);
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
