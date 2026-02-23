import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { StateCreator } from 'zustand';
import useLibraryStore from './useLibraryStore';
import { arrayMove } from '@dnd-kit/sortable';
import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import { playlistService } from '@renderer/services/playlistService';

const logger = createRendererLogger('PlaylistStore');

interface PlaylistState {
  api: {
    reorderTracks: (playlistID: string, from: number, to: number) => void;
    addTracks: (playlistID: string, tracks: TrackModel | TrackModel[]) => void;
    removeTracks: (
      playlistID: string,
      tracks: TrackModel | TrackModel[],
    ) => void;
    toggleFavorite: (playlistID: string) => void;
    renamePlaylist: (playlistID: string, newTitle: string) => void;
    removePlaylist: (playlists: PlaylistModel | PlaylistModel[]) => void;
  };
}

const usePlaylistStore = createPlaylistStore<PlaylistState>(() => {
  const libraryAPI = useLibraryStore.getState().api;

  return {
    api: {
      reorderTracks: (playlistID, from, to) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);

        if (!playlist) return;

        const reorderedTracks = arrayMove(playlist.tracks, from, to);

        const updatedPlaylist: PlaylistModel = {
          ...playlist,
          tracks: reorderedTracks,
        };

        logger.debug(`Reordered track for playlist: ${updatedPlaylist.title}`);

        libraryAPI.updateLocalPlaylist(updatedPlaylist);
        playlistService.update(updatedPlaylist);
      },
      addTracks: (playlistID: string, tracks: TrackModel | TrackModel[]) => {
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
        libraryAPI.updateLocalPlaylist(updatedPlaylist);
        playlistService.update(updatedPlaylist);
      },
      removeTracks: (playlistID: string, tracks: TrackModel | TrackModel[]) => {
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
        libraryAPI.updateLocalPlaylist(updatedPlaylist);
        playlistService.update(updatedPlaylist);
      },
      toggleFavorite: (playlistID: string) => {
        const playlist = libraryAPI.getPlaylistFromID(playlistID);
        if (!playlist) return;

        logger.info(`Toggling favorite for playlist: ${playlist.title}`);

        const newFavoriteState = !playlist.favorite;
        const dateFavorited = newFavoriteState ? new Date() : undefined;
        const updatedPlaylist = {
          ...playlist,
          favorite: newFavoriteState,
          dateFavorited: dateFavorited,
        };

        libraryAPI.updateLocalPlaylist(updatedPlaylist);
        playlistService.updateFavorite(updatedPlaylist._id);
      },
      renamePlaylist: (playlistID: string, newTitle: string) => {
        if (!newTitle || newTitle.trim() === '') {
          logger.warn('Playlist title cannot be empty.');
          return;
        }

        const playlist = libraryAPI.getPlaylistFromID(playlistID);
        if (!playlist) return;

        const updatedPlaylist = {
          ...playlist,
          title: newTitle,
        };

        logger.info(`Renamed playlist: ${playlist.title} to ${newTitle}`);
        libraryAPI.updateLocalPlaylist(updatedPlaylist);
        playlistService.update(updatedPlaylist);
      },
      removePlaylist: (playlists: PlaylistModel | PlaylistModel[]) => {
        const playlistsArray = Array.isArray(playlists)
          ? playlists
          : [playlists];
        libraryAPI.removePlaylists(playlistsArray);
        playlistService.delete(playlistsArray);
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
