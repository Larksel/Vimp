import { createRendererLogger } from '@renderer/utils/logger';
import { StateCreator } from 'zustand';

import { AudioItem, Playlist, VideoItem } from '@shared/types/entities';
import { storeUtils } from '@renderer/utils/storeUtils';
import { libraryService } from '@renderer/services/libraryService';

const logger = createRendererLogger('LibraryStore');

interface LibraryState {
  loading: {
    audio: boolean;
    videos: boolean;
    playlists: boolean;
  };
  contents: {
    audio: AudioItem[];
    videos: VideoItem[];
    playlists: Playlist[];
  };
  api: {
    setAudio: (items: AudioItem[]) => void;
    setVideos: (items: VideoItem[]) => void;
    setPlaylists: (playlists: Playlist[]) => void;
    updateLocalAudio: (item: AudioItem) => void;
    updateLocalPlaylist: (playlist: Playlist) => void;
    removePlaylists: (playlists: Playlist | Playlist[]) => void;
    getPlaylistFromID: (id: number) => Playlist | null;
    getAudioFromIDs: (ids: number[]) => AudioItem[];
    scanFolders: (paths?: string[]) => Promise<void>;
  };
}

const useLibraryStore = createLibraryStore<LibraryState>((set, get) => {
  logger.info('Initializing LibraryStore');

  return {
    loading: {
      audio: true,
      videos: true,
      playlists: true,
    },
    contents: {
      audio: [],
      videos: [],
      playlists: [],
    },
    api: {
      setAudio: (items) => {
        if (!items) return;
        logger.debug('Updated audio items');
        set((state) => ({
          loading: { ...state.loading, audio: false },
          contents: { ...state.contents, audio: items },
        }));
      },
      setVideos: (items) => {
        if (!items) return;
        logger.debug('Updated video items');
        set((state) => ({
          loading: { ...state.loading, videos: false },
          contents: { ...state.contents, videos: items },
        }));
      },
      setPlaylists: (playlists) => {
        if (!playlists) return;
        logger.debug('Updated playlists');
        set((state) => ({
          loading: { ...state.loading, playlists: false },
          contents: { ...state.contents, playlists },
        }));
      },
      // Optimistic Updates
      updateLocalAudio: (item) => {
        const { audio } = get().contents;
        const index = audio.findIndex((a) => a.id === item.id);
        if (index === -1) return;
        const updated = [...audio];
        updated[index] = item;
        set((state) => ({
          contents: { ...state.contents, audio: updated },
        }));
      },
      // Optimistic Updates
      updateLocalPlaylist: (playlist) => {
        const { playlists } = get().contents;
        const index = playlists.findIndex((p) => p.id === playlist.id);
        if (index === -1) return;
        const updated = [...playlists];
        updated[index] = playlist;
        set((state) => ({
          contents: { ...state.contents, playlists: updated },
        }));
      },
      // TODO Criar um método similar para Media
      removePlaylists: (playlistsToDelete) => {
        const { playlists } = get().contents;
        const toDelete = Array.isArray(playlistsToDelete)
          ? playlistsToDelete
          : [playlistsToDelete];
        const deletedIDs = new Set(toDelete.map((p) => p.id));
        set((state) => ({
          contents: {
            ...state.contents,
            playlists: playlists.filter((p) => !deletedIDs.has(p.id)),
          },
        }));
      },
      getPlaylistFromID: (id) => {
        if (!id) return null;
        return get().contents.playlists.find((p) => p.id === id) ?? null;
      },
      getAudioFromIDs: (ids) => {
        if (!ids || ids.length === 0) return [];
        const { audio } = get().contents;
        const idSet = new Set(ids);
        return audio.filter((item) => idSet.has(item.id));
      },
      scanFolders: async (paths) => {
        await libraryService.scanFolders(paths);
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
