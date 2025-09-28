import { createRendererLogger } from '@renderer/utils/logger';
import { useEffect, useCallback } from 'react';
import placeholderImage from '@renderer/assets/images/placeholder.png';

import useCurrentTrack from './useCurrentTrack';
import { PlayerService } from '../services/playerService';
import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';

const logger = createRendererLogger('useMediaSession');

/**
 * Hook to manage MediaSessionAPI integration.
 */
export default function useMediaSession() {
  const currentTrack = useCurrentTrack();
  const currentTime = usePlayerStore((state) => state.currentTime);
  const playerAPI = usePlayerAPI();

  /**
   * Update MediaSession playback position state.
   */
  const updatePositionState = useCallback(() => {
    if (currentTrack) {
      navigator.mediaSession.setPositionState({
        duration: currentTrack.duration,
        playbackRate: PlayerService.getAudio().playbackRate,
        position: currentTime,
      });
    }
  }, [currentTime, currentTrack]);

  /**
   * Configure MediaSession action handlers.
   */
  const configureActionHandlers = useCallback(() => {
    navigator.mediaSession.setActionHandler('play', () => {
      logger.debug('Play action triggered');
      playerAPI.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      logger.debug('Pause action triggered');
      playerAPI.pause();
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      logger.debug('Stop action triggered');
      playerAPI.stop();
    });

    navigator.mediaSession.setActionHandler('seekto', (e) => {
      logger.debug('SeekTo action triggered');
      if (e.seekTime) playerAPI.seekTo(e.seekTime);
    });

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      logger.debug('SeekBackward 10s action triggered');
      PlayerService.setCurrentTime(
        Math.max(PlayerService.getCurrentTime() - 10, 0),
      );
    });

    navigator.mediaSession.setActionHandler('seekforward', () => {
      logger.debug('SeekForward 10s action triggered');
      PlayerService.setCurrentTime(
        Math.min(
          PlayerService.getCurrentTime() + 10,
          currentTrack ? currentTrack.duration : 0,
        ),
      );
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      logger.debug('PreviousTrack action triggered');
      playerAPI.playPreviousTrack();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      logger.debug('NextTrack action triggered');
      playerAPI.playNextTrack();
    });
  }, [currentTrack, playerAPI]);

  useEffect(() => {
    if (currentTrack) {
      const artists = Array.isArray(currentTrack.artist)
        ? currentTrack.artist.join(', ')
        : currentTrack.artist;

      logger.debug(`Metadata set for track: ${currentTrack.title}`);

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: artists,
        album: currentTrack.album,
        artwork: [{ src: currentTrack.cover ?? placeholderImage }],
      });
    }

    configureActionHandlers();

    return function clearActionHandlers() {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('stop', null);
      navigator.mediaSession.setActionHandler('seekto', null);
      navigator.mediaSession.setActionHandler('seekbackward', null);
      navigator.mediaSession.setActionHandler('seekforward', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
    };
  }, [configureActionHandlers, currentTrack]);

  useEffect(() => {
    updatePositionState();
  }, [updatePositionState]);
}
