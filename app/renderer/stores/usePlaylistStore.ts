import { StateCreator } from 'zustand';
import { createRendererLogger } from '@render-utils/logger';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';
import { PlaylistPersistenceService } from '@features/data';
import useLibraryStore from './useLibraryStore';

const logger = createRendererLogger('PlaylistStore');

interface PlaylistState {
  api: {
    addTracks: (
      playlistID: string,
      tracks: TrackModel | TrackModel[],
    ) => Promise<void>;
    removeTracks: (
      playlistID: string,
      tracks: TrackModel | TrackModel[],
    ) => Promise<void>;
    toggleFavorite: (playlistID: string) => Promise<void>;
    renamePlaylist: (playlistID: string, newTitle: string) => Promise<void>;
    removePlaylist: (
      playlists: PlaylistModel | PlaylistModel[],
    ) => Promise<void>;
  };
}

const usePlaylistStore = createPlaylistStore<PlaylistState>(() => {
  const libraryAPI = useLibraryStore.getState().api;

  return {
    api: {
      addTracks: async (playlistID, tracks) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (!playlist) return;

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const addedTrackIDs = tracksArray.map((track) => track._id);

        // Filter out tracks that are already in the playlist to avoid duplicates
        const newTracksToAdd = addedTrackIDs.filter(
          (trackID) => !playlist.tracks.includes(trackID),
        );

        if (newTracksToAdd.length === 0) {
          logger.info(`No new tracks to add to playlist: ${playlist.title}`);
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: [...playlist.tracks, ...newTracksToAdd],
        };

        logger.info(
          `Added ${newTracksToAdd.length} tracks to playlist: ${playlist.title}`,
        );
        await PlaylistPersistenceService.update(updatedPlaylist);
      },
      removeTracks: async (playlistID, tracks) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (!playlist) return;

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const removedTrackIDs = new Set(tracksArray.map((track) => track._id));

        const updatedTracks = playlist.tracks.filter(
          (trackID) => !removedTrackIDs.has(trackID),
        );

        // Check if any tracks were actually removed to avoid unnecessary updates
        if (updatedTracks.length === playlist.tracks.length) {
          logger.info(`No tracks to remove from playlist: ${playlist.title}`);
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: updatedTracks,
        };

        logger.info(
          `Removed ${playlist.tracks.length - updatedTracks.length} tracks from playlist: ${playlist.title}`,
        );
        await PlaylistPersistenceService.update(updatedPlaylist);
      },
      toggleFavorite: async (playlistID) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (playlist) {
          logger.info(`Toggling favorite for playlist: ${playlist.title}`);
          await PlaylistPersistenceService.updateFavorite(playlist._id);
        }
      },
      renamePlaylist: async (playlistID, newTitle) => {
        if (!newTitle || newTitle.trim() === '') {
          logger.warn('Playlist title cannot be empty.');
          return;
        }

        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (playlist) {
          const updatedPlaylist = {
            ...playlist,
            title: newTitle,
          };

          logger.info(`Renamed playlist: ${playlist.title} to ${newTitle}`);
          await PlaylistPersistenceService.update(updatedPlaylist);
        }
      },
      removePlaylist: async (playlists) => {
        await PlaylistPersistenceService.delete(playlists);
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
