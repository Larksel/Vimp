import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';

import { TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';
import { PlaylistPersistenceService } from '@features/data';
import useLibraryStore from './useLibraryStore';

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
          log.debug(
            `[PlaylistStore] No new tracks to add to playlist: ${playlist.title}`,
          );
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: [...playlist.tracks, ...newTracksToAdd],
        };

        log.debug(
          `[PlaylistStore] Added ${newTracksToAdd.length} tracks to playlist: ${playlist.title}`,
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
          log.debug(
            `[PlaylistStore] No tracks to remove from playlist: ${playlist.title}`,
          );
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: updatedTracks,
        };

        log.debug(
          `[PlaylistStore] Removed ${playlist.tracks.length - updatedTracks.length} tracks from playlist: ${playlist.title}`,
        );
        await PlaylistPersistenceService.update(updatedPlaylist);
      },
      toggleFavorite: async (playlistID) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (playlist) {
          log.debug(
            `[PlaylistStore] Toggling favorite for playlist: ${playlist.title}`,
          );
          await PlaylistPersistenceService.updateFavorite(playlist._id);
        }
      },
      renamePlaylist: async (playlistID, newTitle) => {
        if (!newTitle || newTitle.trim() === '') {
          log.warn('[PlaylistStore] Playlist title cannot be empty.');
          return;
        }

        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (playlist) {
          const updatedPlaylist = {
            ...playlist,
            title: newTitle,
          };

          log.debug(
            `[PlaylistStore] Renamed playlist: ${playlist.title} to ${newTitle}`,
          );
          await PlaylistPersistenceService.update(updatedPlaylist);
        }
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
