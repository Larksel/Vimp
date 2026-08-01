import IPCChannels from '@shared/constants/IPCChannels';
import { Playlist, PlaylistWithItems } from '@shared/types/entities';
import debounce from 'lodash/debounce';

export const playlistService = {
  getAll: async (): Promise<Playlist[]> => {
    return window.VimpAPI.playlist.getAll();
  },
  getItems: async (id: number): Promise<PlaylistWithItems> => {
    return window.VimpAPI.playlist.getItems(id);
  },
  create: async (
    data: Parameters<typeof window.VimpAPI.playlist.create>[0],
  ) => {
    return window.VimpAPI.playlist.create(data);
  },
  update: async (
    id: number,
    data: Parameters<typeof window.VimpAPI.playlist.update>[1],
  ) => {
    return window.VimpAPI.playlist.update(id, data);
  },
  deleteById: async (id: number): Promise<void> => {
    await window.VimpAPI.playlist.deleteById(id);
  },
  toggleFavorite: async (id: number): Promise<void> => {
    await window.VimpAPI.playlist.toggleFavorite(id);
  },
  addMedia: async (
    playlistId: number,
    mediaId: number,
    position?: number,
  ): Promise<void> => {
    await window.VimpAPI.playlist.addMedia(playlistId, mediaId, position);
  },
  removeMedia: async (playlistId: number, mediaId: number): Promise<void> => {
    await window.VimpAPI.playlist.removeMedia(playlistId, mediaId);
  },
  moveItem: async (itemId: number, position: number): Promise<void> => {
    await window.VimpAPI.playlist.moveItem(itemId, position);
  },
  cleanupMissing: async (): Promise<void> => {
    await window.VimpAPI.playlist.cleanupMissing();
  },
  onChanged: (callback: () => void) => {
    window.VimpAPI.playlist.onChanged(debounce(callback, 500));
  },
  clearListeners: () => {
    window.VimpAPI.app.removeAllListeners(IPCChannels.PLAYLIST_HAS_CHANGED);
  },
};
