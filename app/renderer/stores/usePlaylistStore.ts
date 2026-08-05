import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { StateCreator } from 'zustand';
import useLibraryStore from './useLibraryStore';
import { Playlist } from '@shared/types/entities';
import { playlistService } from '@renderer/services/playlistService';

const logger = createRendererLogger('PlaylistStore');

interface PlaylistState {
  api: {
    reorderTracks: (
      playlistId: number,
      itemId: number,
      position: number,
    ) => Promise<void>;
    addMedia: (playlistId: number, mediaId: number) => Promise<void>;
    removeMedia: (playlistId: number, mediaId: number) => Promise<void>;
    toggleFavorite: (playlistId: number) => Promise<void>;
    renamePlaylist: (playlistId: number, newName: string) => Promise<void>;
    removePlaylist: (playlist: Playlist) => Promise<void>;
  };
}

const usePlaylistStore = createPlaylistStore<PlaylistState>(() => {
  const libraryAPI = useLibraryStore.getState().api;

  return {
    api: {
      reorderTracks: async (playlistId, itemId, position) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistId);
        if (!playlist) return;

        logger.debug(
          `Reordering item ${itemId} to position ${position} in playlist ${playlist.name}`,
        );

        await playlistService.moveItem(itemId, position);
      },
      addMedia: async (playlistId, mediaId) => {
        logger.debug(`Adding media ${mediaId} to playlist ${playlistId}`);
        await playlistService.addMedia(playlistId, mediaId);
      },
      removeMedia: async (playlistId, mediaId) => {
        logger.debug(`Removing media ${mediaId} from playlist ${playlistId}`);
        await playlistService.removeMedia(playlistId, mediaId);
      },
      toggleFavorite: async (playlistId) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistId);
        if (!playlist) return;

        logger.info(`Toggling favorite for playlist: ${playlist.name}`);

        libraryAPI.updateLocalPlaylist({
          ...playlist,
          isFavorite: !playlist.isFavorite,
          favoritedAt: !playlist.isFavorite ? new Date() : null,
        });

        await playlistService.toggleFavorite(playlistId);
      },
      renamePlaylist: async (playlistId, newName) => {
        if (!newName || newName.trim() === '') {
          logger.warn('Playlist name cannot be empty.');
          return;
        }

        const playlist = libraryAPI.getPlaylistFromID(playlistId);
        if (!playlist) return;

        logger.info(`Renaming playlist: ${playlist.name} to ${newName}`);

        libraryAPI.updateLocalPlaylist({ ...playlist, name: newName });
        await playlistService.update(playlistId, { name: newName });
      },
      removePlaylist: async (playlist) => {
        libraryAPI.removePlaylists(playlist);
        await playlistService.deleteById(playlist.id);
      },
    },
  };
});

export default usePlaylistStore;

export function usePlaylistAPI() {
  return usePlaylistStore((state) => state.api);
}

function createPlaylistStore<T extends PlaylistState>(store: StateCreator<T>) {
  return storeUtils.createStore(store);
}
