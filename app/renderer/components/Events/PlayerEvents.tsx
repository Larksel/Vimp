import { PlayerService } from '@features/player';
import { usePlayerAPI } from '@stores/usePlayerStore';
import { useEffect } from 'react';

export default function PlayerEvents() {
  const playerAPI = usePlayerAPI();

  useEffect(() => {
    PlayerService.getAudio().addEventListener('ended', playerAPI.next);

    return function cleanup() {
      PlayerService.getAudio().removeEventListener('ended', playerAPI.next);
    };
  }, [playerAPI]);

  return null;
}
