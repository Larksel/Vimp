import { createRendererLogger } from '@renderer/utils/logger';
import { StateCreator } from 'zustand';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@renderer/utils/storeUtils';
import { libraryService } from '@renderer/services/libraryService';

const logger = createRendererLogger('LibraryStore');

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
    updateLocalPlaylist: (playlist: PlaylistModel) => void;
    updateLocalTrack: (track: TrackModel) => void;
    removePlaylists: (
      playlistsToDelete: PlaylistModel | PlaylistModel[],
    ) => void;
    scanFolders: (paths?: string[]) => Promise<void>;
    setTracks: (tracks: TrackModel[]) => void;
    setPlaylists: (playlists: PlaylistModel[]) => void;
    getPlaylistFromID: (playlistID: string) => PlaylistModel | null;
    getTracksFromIDs: (trackIDs?: string[]) => TrackModel[];
  };
}

const useLibraryStore = createLibraryStore<LibraryState>((set, get) => {
  logger.info('Initializing LibraryStore');

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
      updateLocalPlaylist: (playlist) => {
        const { playlists } = get().contents;

        if (!playlist) return;

        const playlistIndex = playlists.findIndex(
          (pl) => pl._id === playlist._id,
        );

        if (playlistIndex === -1) return;

        const newPlaylists = [...playlists];
        newPlaylists[playlistIndex] = playlist;

        set((state) => ({
          contents: {
            ...state.contents,
            playlists: newPlaylists,
          },
        }));
      },
      updateLocalTrack: (track) => {
        const { tracks } = get().contents;

        if (!track) return;

        const trackIndex = tracks.findIndex((t) => t._id === track._id);

        if (trackIndex === -1) return;

        const newTracks = [...tracks];
        newTracks[trackIndex] = track;

        set((state) => ({
          contents: {
            ...state.contents,
            tracks: newTracks,
          },
        }));
      },
      removePlaylists: (playlistsToDelete) => {
        const { playlists } = get().contents;

        const deletedPlaylists = Array.isArray(playlistsToDelete)
          ? playlistsToDelete
          : [playlistsToDelete];
        const deletedPlaylistsSet = new Set(deletedPlaylists.map((p) => p._id));

        const newPlaylists = playlists.filter(
          (item) => !deletedPlaylistsSet.has(item._id),
        );
        set((state) => ({
          contents: {
            ...state.contents,
            playlists: newPlaylists,
          },
        }));
      },
      scanFolders: async (paths) => {
        libraryService.scanFolders(paths);
      },
      setTracks: (tracks) => {
        if (!tracks) return;

        logger.debug('Updated tracks');
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

        logger.debug('Updated playlists');
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
  };
});

export default useLibraryStore;

export function useLibraryAPI() {
  return useLibraryStore((state) => state.api);
}

function createLibraryStore<T extends LibraryState>(store: StateCreator<T>) {
  return storeUtils.createStore(store);
}
