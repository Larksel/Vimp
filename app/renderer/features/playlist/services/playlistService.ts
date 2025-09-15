import { arrayMove } from '@dnd-kit/sortable';
import { PlaylistPersistenceService } from '@renderer/features/data';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { PlaylistModel, TrackModel } from '@shared/types/vimp';

const logger = createRendererLogger('PlaylistService');
const libraryAPI = useLibraryStore.getState().api;

export const PlaylistService = {
  reorderTracks: (playlistID: string, from: number, to: number) => {
    const playlist = libraryAPI.getPlaylistFromID(playlistID);

    if (!playlist) return;

    const reorderedTracks = arrayMove(playlist.tracks, from, to);

    const updatedPlaylist: PlaylistModel = {
      ...playlist,
      tracks: reorderedTracks,
    };

    logger.debug(`Reordered track for playlist: ${updatedPlaylist.title}`);

    libraryAPI.updateLocalPlaylist(updatedPlaylist);
    PlaylistPersistenceService.update(updatedPlaylist);
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
    PlaylistPersistenceService.update(updatedPlaylist);
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
    PlaylistPersistenceService.update(updatedPlaylist);
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
    PlaylistPersistenceService.updateFavorite(updatedPlaylist._id);
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
    PlaylistPersistenceService.update(updatedPlaylist);
  },
  removePlaylist: (playlists: PlaylistModel | PlaylistModel[]) => {
    const playlistsArray = Array.isArray(playlists) ? playlists : [playlists];
    libraryAPI.removePlaylists(playlistsArray);
    PlaylistPersistenceService.delete(playlistsArray);
  },
};
