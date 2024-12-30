import { useEffect, useCallback } from 'react';

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
      navigator.mediaSession.setPositionState({
        duration: player.getTrackDuration(),
        playbackRate: player.getAudio().playbackRate,
        position: currentTime,
      });
    }
  }, [currentTrack]);

  /**
   * Configure MediaSession action handlers.
   */
  const configureActionHandlers = useCallback(() => {
    navigator.mediaSession.setActionHandler('play', playerAPI.play);
    navigator.mediaSession.setActionHandler('pause', playerAPI.pause);
    navigator.mediaSession.setActionHandler('stop', playerAPI.stop);
    navigator.mediaSession.setActionHandler('seekto', (e) => {
      if (e.seekTime) playerAPI.setSongProgress(e.seekTime);
    });
    navigator.mediaSession.setActionHandler('seekbackward', () => {
      player.setCurrentTime(Math.max(player.getCurrentTime() - 10, 0));
    });
    navigator.mediaSession.setActionHandler('seekforward', () => {
      player.setCurrentTime(
        Math.min(player.getCurrentTime() + 10, player.getTrackDuration()),
      );
    });
    navigator.mediaSession.setActionHandler(
      'previoustrack',
      playerAPI.previous,
    );
    navigator.mediaSession.setActionHandler('nexttrack', playerAPI.next);
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
