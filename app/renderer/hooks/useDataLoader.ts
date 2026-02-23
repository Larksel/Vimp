import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { useCallback, useEffect } from 'react';
import { TrackPersistenceService } from '@renderer/services/trackPersistence';
import { PlaylistService } from '@renderer/services/playlistService';
import { sortUtils } from '@shared/utils/sortUtils';

const logger = createRendererLogger('useDataLoader');

export default function useDataLoader() {
  const libraryAPI = useLibraryAPI();

  const handleTracksDBChange = useCallback(async () => {
    logger.debug('Refreshing tracks');

    const dbTracks = await TrackPersistenceService.getAll();
    const tracks = sortUtils.sortByString(dbTracks, 'title');

    libraryAPI.setTracks(tracks);
  }, [libraryAPI]);

  const handlePlaylistsDBChange = useCallback(async () => {
    logger.debug('Refreshing playlists');

    const dbPlaylists = await PlaylistService.getAll();
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  const loadData = useCallback(async () => {
    logger.debug('Loading data');

    const dbTracks = await TrackPersistenceService.getAll();
    const dbPlaylists = await PlaylistService.getAll();

    const tracks = sortUtils.sortByString(dbTracks, 'title');
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setTracks(tracks);
    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  useEffect(() => {
    TrackPersistenceService.onDBChanged(handleTracksDBChange);
    PlaylistService.onDBChanged(handlePlaylistsDBChange);

    loadData();

    return function cleanup() {
      TrackPersistenceService.clearListeners();
      PlaylistService.clearListeners();
    };
  }, [handlePlaylistsDBChange, handleTracksDBChange, loadData]);
}
