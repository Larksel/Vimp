import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { useCallback, useEffect } from 'react';
import { trackService } from '@renderer/services/trackService';
import { playlistService } from '@renderer/services/playlistService';
import { sortUtils } from '@shared/utils/sortUtils';

const logger = createRendererLogger('useDataLoader');

export default function useDataLoader() {
  const libraryAPI = useLibraryAPI();

  const handleTracksDBChange = useCallback(async () => {
    logger.debug('Refreshing tracks');

    const dbTracks = await trackService.getAll();
    const tracks = sortUtils.sortByString(dbTracks, 'title');

    libraryAPI.setTracks(tracks);
  }, [libraryAPI]);

  const handlePlaylistsDBChange = useCallback(async () => {
    logger.debug('Refreshing playlists');

    const dbPlaylists = await playlistService.getAll();
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  const loadData = useCallback(async () => {
    logger.debug('Loading data');

    const dbTracks = await trackService.getAll();
    const dbPlaylists = await playlistService.getAll();

    const tracks = sortUtils.sortByString(dbTracks, 'title');
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setTracks(tracks);
    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  useEffect(() => {
    trackService.onDBChanged(handleTracksDBChange);
    playlistService.onDBChanged(handlePlaylistsDBChange);

    loadData();

    return function cleanup() {
      trackService.clearListeners();
      playlistService.clearListeners();
    };
  }, [handlePlaylistsDBChange, handleTracksDBChange, loadData]);
}
