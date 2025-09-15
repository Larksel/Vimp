import { createRendererLogger } from '@renderer/utils/logger';
import { StateCreator } from 'zustand';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@renderer/utils/storeUtils';
import { arrayMove } from '@dnd-kit/sortable';
import { PlaylistPersistenceService } from '@renderer/features/data';

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
    reorderTracks: (playlistID: string, from: number, to: number) => void;
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
      reorderTracks: (playlistID, from, to) => {
        const { playlists } = get().contents;
        const playlistIndex = playlists.findIndex(
          (playlist) => playlist._id === playlistID,
        );
        const playlist = playlists[playlistIndex];

        if (!playlist) return;

        const reorderedTracks = arrayMove(playlist.tracks, from, to);

        const updatedPlaylist: PlaylistModel = {
          ...playlist,
          tracks: reorderedTracks,
        };

        const newPlaylists = [...playlists];
        newPlaylists[playlistIndex] = updatedPlaylist;

        set((state) => ({
          contents: {
            ...state.contents,
            playlists: newPlaylists,
          },
        }));
        PlaylistPersistenceService.update(updatedPlaylist);
      },
      scanFolders: async (paths) => {
        await window.VimpAPI.library.scanAndSave(paths);
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
