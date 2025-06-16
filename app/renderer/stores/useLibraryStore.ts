import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';

import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';

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

        const { loading, contents } = get();

        log.info('[LibraryStore] Updated tracks');
        set({
          loading: {
            ...loading,
            tracks: false,
          },
          contents: {
            ...contents,
            tracks: tracks,
          },
        });
      },
      setPlaylists: (playlists) => {
        if (!playlists) return;

        const { loading, contents } = get();

        log.info('[LibraryStore] Updated playlists');
        set({
          loading: {
            ...loading,
            playlists: false,
          },
          contents: {
            ...contents,
            playlists: playlists,
          },
        });
      },
      getPlaylistFromID: (playlistID) => {
        if (!playlistID || playlistID === '') return null;

        const { playlists } = get().contents;

        const playlist = playlists.find(
          (playlist) => playlist._id === playlistID,
        );

        if (!playlist) return null;
        return playlist;
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
      addTracks: async (playlistID, tracks) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const addedTracksIDs = tracksArray.map((track) => track._id);

        if (playlist) {
          const updatedPlaylist = {
            ...playlist,
            tracks: [...playlist.tracks, ...addedTracksIDs],
          };
          log.debug(
            `[LibraryStore] Added ${addedTracksIDs.length} tracks to playlist: ${playlist.title}`,
          );
          await window.VimpAPI.playlistsDB.update(updatedPlaylist);
        }
      },
      removeTracks: async (playlistID, tracks) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
        const removedTracksIDs = tracksArray.map((track) => track._id);

        if (playlist) {
          const updatedTracks = playlist.tracks.filter((trackID) =>
            removedTracksIDs.some((removedID) => trackID !== removedID),
          );

          const updatedPlaylist = {
            ...playlist,
            tracks: updatedTracks,
          };

          log.debug(
            `[LibraryStore] Removed ${removedTracksIDs.length} tracks from playlist: ${playlist.title}`,
          );
          await window.VimpAPI.playlistsDB.update(updatedPlaylist);
        }
      },
      toggleFavorite: async (playlistID) => {
        const { getPlaylistFromID } = get().api;
        const playlist = getPlaylistFromID(playlistID);

        if (playlist) {
          log.debug(`[LibraryStore] Favorited playlist: ${playlist.title}`);
          await window.VimpAPI.playlistsDB.updateFavorite(playlist._id);
        }
      },
      renamePlaylist: async (playlistID, newTitle) => {
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
          await window.VimpAPI.playlistsDB.update(updatedPlaylist);
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
