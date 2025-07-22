import { PlayerService } from '@renderer/features/player';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useEffect } from 'react';

export default function PlayerEvents() {
  const playerAPI = usePlayerAPI();

  useEffect(() => {
    PlayerService.getAudio().addEventListener(
      'ended',
      playerAPI.handleTrackEnd,
    );
    PlayerService.getAudio().addEventListener(
      'timeupdate',
      playerAPI.handlePlayerTick,
    );

    return function cleanup() {
      PlayerService.getAudio().removeEventListener(
        'ended',
        playerAPI.handleTrackEnd,
      );
      PlayerService.getAudio().removeEventListener(
        'timeupdate',
        playerAPI.handlePlayerTick,
      );
    };
  }, [playerAPI]);

  return null;
}
