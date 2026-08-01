import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { createRendererLogger } from '@renderer/utils/logger';
import { useCallback, useEffect } from 'react';
import { mediaService } from '@renderer/services/mediaService';
import { playlistService } from '@renderer/services/playlistService';
import { sortUtils } from '@shared/utils/sortUtils';

const logger = createRendererLogger('useDataLoader');

export default function useDataLoader() {
  const libraryAPI = useLibraryAPI();

  const handleMediaChanged = useCallback(async () => {
    logger.debug('Refreshing media items');
    const [audio, videos] = await Promise.all([
      mediaService.getAudioItems(),
      mediaService.getVideoItems(),
    ]);
    libraryAPI.setAudio(sortUtils.sortByString(audio, 'title'));
    libraryAPI.setVideos(sortUtils.sortByString(videos, 'title'));
  }, [libraryAPI]);

  const handlePlaylistsChanged = useCallback(async () => {
    logger.debug('Refreshing playlists');
    const playlists = await playlistService.getAll();
    libraryAPI.setPlaylists(sortUtils.sortByString(playlists, 'name'));
  }, [libraryAPI]);

  const loadData = useCallback(async () => {
    logger.debug('Loading data');
    const [audio, videos, playlists] = await Promise.all([
      mediaService.getAudioItems(),
      mediaService.getVideoItems(),
      playlistService.getAll(),
    ]);
    libraryAPI.setAudio(sortUtils.sortByString(audio, 'title'));
    libraryAPI.setVideos(sortUtils.sortByString(videos, 'title'));
    libraryAPI.setPlaylists(sortUtils.sortByString(playlists, 'name'));
  }, [libraryAPI]);

  useEffect(() => {
    mediaService.onChanged(handleMediaChanged);
    playlistService.onChanged(handlePlaylistsChanged);

    loadData();

    return function cleanup() {
      mediaService.clearListeners();
      playlistService.clearListeners();
    };
  }, [handleMediaChanged, handlePlaylistsChanged, loadData]);
}
