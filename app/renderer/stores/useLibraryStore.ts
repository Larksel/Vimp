import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';
import { PlaylistPersistenceService } from '@features/data';

interface LibraryState {
  loading: {
    tracks: boolean;
    playlists: boolean;
  };
  contents: {
    tracks: TrackModel[];
    playlists: PlaylistModel[];
  };
  api: {
    setTracks: (tracks: TrackModel[]) => void;
    setPlaylists: (playlists: PlaylistModel[]) => void;
    getPlaylistFromID: (playlistID: string) => PlaylistModel | null;
    getTracksFromIDs: (trackIDs?: string[]) => TrackModel[];
  };
  playlistApi: {
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

const useLibraryStore = createLibraryStore<LibraryState>((set, get) => {
  return {
    loading: {
      tracks: true,
      playlists: true,
    },
    contents: {
      tracks: [],
      playlists: [],
    },
    api: {
      setTracks: (tracks) => {
        if (!tracks) return;

        log.info('[LibraryStore] Updated tracks');
        set((state) => ({
          loading: {
            ...state.loading,
            tracks: false,
          },
          contents: {
            ...state.contents,
            tracks: tracks,
          },
        }));
      },
      setPlaylists: (playlists) => {
        if (!playlists) return;

        log.info('[LibraryStore] Updated playlists');
        set((state) => ({
          loading: {
            ...state.loading,
            playlists: false,
          },
          contents: {
            ...state.contents,
            playlists: playlists,
          },
        }));
      },
      getPlaylistFromID: (playlistID) => {
        if (!playlistID || playlistID === '') return null;

        const { playlists } = get().contents;
        return (
          playlists.find((playlist) => playlist._id === playlistID) ?? null
        );
      },
      getTracksFromIDs: (trackIDs) => {
        if (!trackIDs || trackIDs.length === 0) return [];
        const { tracks } = get().contents;

        // Use a Set for faster lookups if trackIDs array is large
        const trackIDSet = new Set(trackIDs);
        return [...tracks.filter((track) => trackIDSet.has(track._id))];
      },
    },
    playlistApi: {
      addTracks: async (playlistID, tracks) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        if (!playlist) return;

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const addedTrackIDs = tracksArray.map((track) => track._id);

        // Filter out tracks that are already in the playlist to avoid duplicates
        const newTracksToAdd = addedTrackIDs.filter(
          (trackID) => !playlist.tracks.includes(trackID),
        );

        if (newTracksToAdd.length === 0) {
          log.debug(
            `[LibraryStore] No new tracks to add to playlist: ${playlist.title}`,
          );
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: [...playlist.tracks, ...newTracksToAdd],
        };

        log.debug(
          `[LibraryStore] Added ${newTracksToAdd.length} tracks to playlist: ${playlist.title}`,
        );
        await PlaylistPersistenceService.update(updatedPlaylist);

        set((state) => ({
          contents: {
            ...state.contents,
            playlists: state.contents.playlists.map((p) =>
              p._id === playlistID ? updatedPlaylist : p,
            ),
          },
        }));
      },
      removeTracks: async (playlistID, tracks) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        if (!playlist) return;

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const removedTrackIDs = new Set(tracksArray.map((track) => track._id));

        const updatedTracks = playlist.tracks.filter(
          (trackID) => !removedTrackIDs.has(trackID),
        );

        // Check if any tracks were actually removed to avoid unnecessary updates
        if (updatedTracks.length === playlist.tracks.length) {
          log.debug(
            `[LibraryStore] No tracks to remove from playlist: ${playlist.title}`,
          );
          return;
        }

        const updatedPlaylist = {
          ...playlist,
          tracks: updatedTracks,
        };

        log.debug(
          `[LibraryStore] Removed ${playlist.tracks.length - updatedTracks.length} tracks from playlist: ${playlist.title}`,
        );
        await PlaylistPersistenceService.update(updatedPlaylist);

        set((state) => ({
          contents: {
            ...state.contents,
            playlists: state.contents.playlists.map((p) =>
              p._id === playlistID ? updatedPlaylist : p,
            ),
          },
        }));

      },
      toggleFavorite: async (playlistID) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        if (playlist) {
          log.debug(
            `[LibraryStore] Toggling favorite for playlist: ${playlist.title}`,
          );
          await PlaylistPersistenceService.updateFavorite(playlist._id);

          set((state) => ({
            contents: {
              ...state.contents,
              playlists: state.contents.playlists.map((p) =>
                p._id === playlistID ? { ...p, favorite: !p.favorite } : p,
              ),
            },
          }));
        }
      },
      renamePlaylist: async (playlistID, newTitle) => {
        if (!newTitle || newTitle.trim() === '') {
          log.warn('[LibraryStore] Playlist title cannot be empty.');
          return;
        }

        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        if (playlist) {
          const updatedPlaylist = {
            ...playlist,
            title: newTitle,
          };

          log.debug(
            `[LibraryStore] Renamed playlist: ${playlist.title} to ${newTitle}`,
          );
          await PlaylistPersistenceService.update(updatedPlaylist);

          set((state) => ({
            contents: {
              ...state.contents,
              playlists: state.contents.playlists.map((p) =>
                p._id === playlistID ? updatedPlaylist : p,
              ),
            },
          }));
        }
      },
    },
  };
});

export default useLibraryStore;

export function useLibraryAPI() {
  return useLibraryStore((state) => state.api);
}

export function usePlaylistAPI() {
  return useLibraryStore((state) => state.playlistApi);
}

function createLibraryStore<T extends LibraryState>(store: StateCreator<T>) {
  return storeUtils.createStore(store);
}
