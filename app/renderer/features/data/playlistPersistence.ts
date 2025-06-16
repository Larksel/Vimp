import { Playlist, PlaylistModel } from '@shared/types/vimp';

export const PlaylistPersistenceService = {
  getAll: async () => {
    return await window.VimpAPI.playlistsDB.getAll();
  },
  getById: async (playlistID: string) => {
    return await window.VimpAPI.playlistsDB.getById(playlistID);
  },
  create: async (newPlaylist: Playlist | Playlist[]) => {
    await window.VimpAPI.playlistsDB.create(newPlaylist);
  },
  update: async (playlists: PlaylistModel | PlaylistModel[]) => {
    await window.VimpAPI.playlistsDB.update(playlists);
  },
  delete: async (playlists: PlaylistModel | PlaylistModel[]) => {
    await window.VimpAPI.playlistsDB.delete(playlists);
  },
  updateFavorite: async (playlistID: string) => {
    await window.VimpAPI.playlistsDB.updateFavorite(playlistID);
  },
  updateLastPlayed: async (playlistID: string) => {
    await window.VimpAPI.playlistsDB.updateLastPlayed(playlistID);
  },
  incrementPlayCount: async (playlistID: string) => {
    await window.VimpAPI.playlistsDB.incrementPlayCount(playlistID);
  },
  clear: async () => {
    await window.VimpAPI.playlistsDB.clear();
  },
};
