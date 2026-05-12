import { ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';

export interface CreatePlaylistInput {
  name: string;
  type: 'audio' | 'video';
  cover?: string | null;
  kind?: 'normal' | 'smart' | 'system';
  sortMode?: 'manual' | 'title' | 'artist' | 'added_at';
  filters?: Record<string, unknown> | null;
  slug?: string | null;
}

const playlist = {
  getAll: () => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_GET_ALL);
  },
  getById: (id: number) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_GET_BY_ID, id);
  },
  getBySlug: (slug: string) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_GET_BY_SLUG, slug);
  },
  create: (data: CreatePlaylistInput) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_CREATE, data);
  },
  update: (id: number, data: Partial<CreatePlaylistInput>) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_UPDATE, id, data);
  },
  deleteById: (id: number) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_DELETE_BY_ID, id);
  },
  addMedia: (playlistId: number, mediaId: number, position?: number) => {
    return ipcRenderer.invoke(
      IPCChannels.PLAYLIST_ADD_MEDIA,
      playlistId,
      mediaId,
      position,
    );
  },
  removeMedia: (playlistId: number, mediaId: number) => {
    return ipcRenderer.invoke(
      IPCChannels.PLAYLIST_REMOVE_MEDIA,
      playlistId,
      mediaId,
    );
  },
  moveItem: (itemId: number, position: number) => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_MOVE_ITEM, itemId, position);
  },
  cleanupMissing: () => {
    return ipcRenderer.invoke(IPCChannels.PLAYLIST_CLEANUP_MISSING);
  },
  onChanged: (callback: () => void) => {
    return ipcRenderer.on(IPCChannels.PLAYLIST_HAS_CHANGED, () => callback());
  },
};

export default playlist;
