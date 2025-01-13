import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import useLibraryStore from '@stores/useLibraryStore';

interface PlaylistLoaderResult {
  playlist: PlaylistModel;
  tracks: TrackModel[];
}

/**
 * Returns the playlist and its tracks.
 */
export default function usePlaylistLoader(
  id?: string,
): PlaylistLoaderResult | null {
  return useLibraryStore((state) => {
    if (
      id &&
      id !== '' &&
      state.contents.playlists.length !== 0 &&
      state.contents.tracks.length !== 0
    ) {
      const { playlists, tracks } = state.contents;

      const playlist = playlists.find(
        (playlist) => playlist._id === id,
      );

      if (playlist) {
        const playlistTracks = playlist.tracks
          .map((id) => tracks.find((track) => track._id === id))
          .filter((track) => !!track);

        return {
          playlist,
          tracks: playlistTracks,
        };
      }

      return null;
    }

    return null;
  });
}
