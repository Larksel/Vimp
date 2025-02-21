import { useEffect, useCallback } from 'react';
import log from 'electron-log/renderer';

import useCurrentTrack from '@hooks/useCurrentTrack';
import usePlayerCurrentTime from '@hooks/usePlayerCurrentTime';
import player from '@features/player';
import { usePlayerAPI } from '@stores/usePlayerStore';

/**
 * Hook to manage MediaSessionAPI integration.
 */
export default function useMediaSession() {
  const currentTrack = useCurrentTrack();
  const currentTime = usePlayerCurrentTime();
  const playerAPI = usePlayerAPI();

  /**
   * Set Media Metadata for the current track.
   */
  const setMediaMetadata = useCallback(() => {
    if (currentTrack) {
      const artists = Array.isArray(currentTrack.artist)
        ? currentTrack.artist.join(', ')
        : currentTrack.artist;

      log.debug(
        '[useMediaSession] Metadata set for track:',
        currentTrack.title,
      );

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentTrack.title,
        artist: artists,
        album: currentTrack.album,
        artwork: currentTrack.cover ? [{ src: currentTrack.cover }] : undefined,
      });
    }
  }, [currentTrack]);

  /**
   * Update MediaSession playback position state.
   */
  const updatePositionState = useCallback(() => {
    if (currentTrack) {
      log.debug(
        '[useMediaSession] Position state set for track:',
        currentTrack.title,
      );
      navigator.mediaSession.setPositionState({
        duration: currentTrack.duration,
        playbackRate: player.getAudio().playbackRate,
        position: currentTime,
      });
    }
  }, [currentTrack]);

  /**
   * Configure MediaSession action handlers.
   */
  const configureActionHandlers = useCallback(() => {
    if (!currentTrack) return;

    navigator.mediaSession.setActionHandler('play', () => {
      log.debug('[useMediaSession] Play action triggered');
      playerAPI.play();
    });

    navigator.mediaSession.setActionHandler('pause', () => {
      log.debug('[useMediaSession] Pause action triggered');
      playerAPI.pause();
    });

    navigator.mediaSession.setActionHandler('stop', () => {
      log.debug('[useMediaSession] Stop action triggered');
      playerAPI.stop();
    });

    navigator.mediaSession.setActionHandler('seekto', (e) => {
      log.debug('[useMediaSession] SeekTo action triggered');
      if (e.seekTime) playerAPI.setSongProgress(e.seekTime);
    });

    navigator.mediaSession.setActionHandler('seekbackward', () => {
      log.debug('[useMediaSession] SeekBackward 10s action triggered');
      player.setCurrentTime(Math.max(player.getCurrentTime() - 10, 0));
    });

    navigator.mediaSession.setActionHandler('seekforward', () => {
      log.debug('[useMediaSession] SeekForward 10s action triggered');
      player.setCurrentTime(
        Math.min(player.getCurrentTime() + 10, currentTrack.duration ?? 0),
      );
    });

    navigator.mediaSession.setActionHandler('previoustrack', () => {
      log.debug('[useMediaSession] PreviousTrack action triggered');
      playerAPI.previous();
    });

    navigator.mediaSession.setActionHandler('nexttrack', () => {
      log.debug('[useMediaSession] NextTrack action triggered');
      playerAPI.next();
    });
  }, [playerAPI]);

  useEffect(() => {
    setMediaMetadata();
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
  }, [setMediaMetadata, configureActionHandlers]);

  useEffect(() => {
    updatePositionState();
  }, [updatePositionState]);
}
