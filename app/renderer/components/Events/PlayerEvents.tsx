import player from '@/features/player';
import { usePlayerAPI } from '@/stores/usePlayerStore';
import { useEffect } from 'react';

export default function PlayerEvents() {
  const playerAPI = usePlayerAPI();

  useEffect(() => {
    player.getAudio().addEventListener('ended', playerAPI.next);

    return function cleanup() {
      player.getAudio().removeEventListener('ended', playerAPI.next);
    };
  }, [playerAPI]);

  return null;
}
