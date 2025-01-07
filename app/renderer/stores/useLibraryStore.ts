import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { createStore } from '@render-utils/utils-store';

interface LibraryState {
  loading: boolean;
  contents: {
    tracks: TrackModel[];
    playlists: PlaylistModel[];
  };
  api: {
    setTracks: (tracks: TrackModel[]) => void;
    setPlaylists: (playlists: PlaylistModel[]) => void;
    getTracksFromIDs: (trackIDs?: string[]) => TrackModel[];
  };
  playlistApi: {
    toggleFavorite: (_id: string) => Promise<void>;
  };
}

const useLibraryStore = createLibraryStore<LibraryState>((set, get) => ({
  loading: false,
  contents: {
    tracks: [],
    playlists: [],
  },
  api: {
    setTracks: (tracks) => {
      if (!tracks) return;

      const { contents } = get();

      log.info('[LibraryStore] Updated tracks');
      set({
        contents: {
          ...contents,
          tracks: tracks,
        },
      });
    },
    setPlaylists: (playlists) => {
      if (!playlists) return;

      const { contents } = get();

      log.info('[LibraryStore] Updated playlists');
      set({
        contents: {
          ...contents,
          playlists: playlists,
        },
      });
    },
    getTracksFromIDs: (trackIDs) => {
      if (!trackIDs || trackIDs.length === 0) return [];
      const { tracks } = get().contents;

      return trackIDs
        .map((id) => tracks.find((track) => track._id === id))
        .filter((track) => !!track);
    },
  },
  playlistApi: {
    toggleFavorite: async (_id) => {
      if (!_id && _id === '') return;

      const { contents } = get();
      const { playlists } = contents;
      const index = playlists.findIndex((playlist) => playlist._id === _id);

      if (index > -1) {
        const playlist = playlists[index];
        await window.VimpAPI.playlistsDB.updateFavorite(playlist._id);

        log.debug(`[LibraryStore] Favorited playlist: ${playlist.title}`);

        const updatedPlaylists = [...playlists];
        updatedPlaylists[index] = {
          ...playlist,
          favorite: !playlist.favorite,
        };

        set({
          contents: {
            ...contents,
            playlists: updatedPlaylists,
          },
        });
      }
    },
  },
}));

export default useLibraryStore;

export function useLibraryAPI() {
  return useLibraryStore((state) => state.api);
}

export function usePlaylistAPI() {
  return useLibraryStore((state) => state.playlistApi);
}

function createLibraryStore<T extends LibraryState>(store: StateCreator<T>) {
  return createStore(store);
}
