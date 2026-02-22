import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useEffect } from 'react';
import getPlayer from '@renderer/core/player';

export default function usePlayerEvents() {
  const { getAudio } = getPlayer();
  const audio = getAudio();
  const playerAPI = usePlayerAPI();

  useEffect(() => {
    audio.addEventListener('ended', playerAPI.handleTrackEnd);
    audio.addEventListener('timeupdate', playerAPI.handlePlayerTick);

    return function cleanup() {
      audio.removeEventListener('ended', playerAPI.handleTrackEnd);
      audio.removeEventListener('timeupdate', playerAPI.handlePlayerTick);
    };
  }, [audio, playerAPI]);

  return null;
}
