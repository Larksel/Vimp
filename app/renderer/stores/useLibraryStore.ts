import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';

import { TrackModel } from '@shared/types/vimp';
import { createStore } from '@render-utils/utils-store';

interface LibraryState {
  loading: boolean;
  contents: {
    tracks: TrackModel[];
  };
  api: {
    setTracks: (tracks: TrackModel[]) => void;
    getTracksFromIDs: (trackIDs?: string[]) => TrackModel[];
  };
}

const useLibraryStore = createLibraryStore<LibraryState>((set, get) => ({
  loading: false,
  contents: {
    tracks: [],
  },
  api: {
    setTracks: (tracks) => {
      if (!tracks) return;

      log.info('[LibraryStore] Updated tracks');
      set({
        contents: {
          tracks: tracks,
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
}));

export default useLibraryStore;

export function useLibraryAPI() {
  return useLibraryStore((state) => state.api);
}

function createLibraryStore<T extends LibraryState>(store: StateCreator<T>) {
  return createStore(store);
}
