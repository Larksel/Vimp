import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { useCallback, useEffect } from 'react';
import { TrackPersistenceService } from '../services/trackPersistence';
import { PlaylistPersistenceService } from '../services/playlistPersistence';
import { sortUtils } from '@renderer/utils/sortUtils';
import debounce from 'lodash/debounce';
import IPCChannels from '@shared/constants/IPCChannels';

const logger = createRendererLogger('useDataLoader');

export default function useDataLoader() {
  const libraryAPI = useLibraryAPI();
  const playerAPI = usePlayerAPI();

  const loadTracks = useCallback(async () => {
    logger.debug('Loading tracks');
    const dbTracks = await TrackPersistenceService.getAll();

    const tracks = sortUtils.sortByString(dbTracks, 'title');
    libraryAPI.setTracks(tracks);
    playerAPI.refreshQueueMetadata(tracks);
  }, [libraryAPI, playerAPI]);

  const loadPlaylists = useCallback(async () => {
    logger.debug('Loading playlists');
    const dbPlaylists = await PlaylistPersistenceService.getAll();
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setPlaylists(playlists);
  }, [libraryAPI]);

  useEffect(() => {
    window.VimpAPI.app.onDBChanged(
      debounce(() => {
        logger.debug('DB changed');
        loadTracks();
        loadPlaylists();
      }, 500),
    );

    loadTracks();
    loadPlaylists();

    return function cleanup() {
      window.VimpAPI.app.removeAllListeners(IPCChannels.DB_HAS_CHANGED);
    };
  }, [loadPlaylists, loadTracks]);
}
