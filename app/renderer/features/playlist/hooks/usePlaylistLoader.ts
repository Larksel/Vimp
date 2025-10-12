import { PlaylistModel, TrackModel } from '@shared/types/vimp';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import { useMemo } from 'react';

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
  const { playlists, tracks } = useLibraryStore((state) => state.contents);

  const playlistLoaderResult = useMemo(() => {
    if (!id || id === '' || playlists.length === 0) return null;

    const playlist = playlists.find((playlist) => playlist._id === id);

    if (!playlist) return null;

    const playlistTracks = playlist.tracks
      .map((trackId) => tracks.find((track) => track._id === trackId))
      .filter((track): track is TrackModel => !!track);

    return {
      playlist,
      tracks: playlistTracks,
    };
  }, [id, playlists, tracks]);

  return playlistLoaderResult;
}
