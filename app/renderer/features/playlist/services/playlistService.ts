import { arrayMove } from '@dnd-kit/sortable';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { PlaylistModel } from '@shared/types/vimp';

const logger = createRendererLogger('PlaylistService');
const libraryAPI = useLibraryStore.getState().api;

export const PlaylistService = {
  reorderTracks: async (playlistID: string, from: number, to: number) => {
    const playlist = libraryAPI.getPlaylistFromID(playlistID);

    if (!playlist) return;

    const reorderedTracks = arrayMove(playlist.tracks, from, to);

    const updatedPlaylist: PlaylistModel = {
      ...playlist,
      tracks: reorderedTracks,
    };

    logger.debug(`Reordered track for playlist: ${updatedPlaylist.title}`);

    libraryAPI.updatePlaylist(updatedPlaylist);
  },
};
