import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { useCallback, useEffect } from 'react';
import { TrackPersistenceService } from '../services/trackPersistence';
import { PlaylistPersistenceService } from '../services/playlistPersistence';
import { sortUtils } from '@shared/utils/sortUtils';
import debounce from 'lodash/debounce';
import IPCChannels from '@shared/constants/IPCChannels';

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
    const dbPlaylists = await PlaylistPersistenceService.getAll();
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  const loadData = useCallback(async () => {
    logger.debug('Loading data');
    const tracks = await TrackPersistenceService.getAll();
    const playlists = await PlaylistPersistenceService.getAll();

    libraryAPI.setTracks(tracks);
    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  useEffect(() => {
    window.VimpAPI.tracksDB.onDBChanged(
      debounce(() => {
        logger.debug('TracksDB changed');
        handleTracksDBChange();
      }, 500),
    );

    window.VimpAPI.playlistsDB.onDBChanged(
      debounce(() => {
        logger.debug('PlaylistsDB changed');
        handlePlaylistsDBChange();
      }, 500),
    );

    loadData();

    return function cleanup() {
      window.VimpAPI.app.removeAllListeners(IPCChannels.TRACKSDB_HAS_CHANGED);
      window.VimpAPI.app.removeAllListeners(
        IPCChannels.PLAYLISTSDB_HAS_CHANGED,
      );
    };
  }, [handlePlaylistsDBChange, handleTracksDBChange, loadData]);
}
