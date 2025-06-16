import { useCallback, useEffect, useState } from 'react';

import { PlayerService } from '@features/player';

/**
 * Returns the current track elapsed time
 */
export default function usePlayerCurrentTime(): number {
  const [currentTime, setCurrentTime] = useState(
    PlayerService.getCurrentTime(),
  );

  const tick = useCallback(() => {
    setCurrentTime(PlayerService.getCurrentTime());
  }, [setCurrentTime]);

  useEffect(() => {
    PlayerService.getAudio().addEventListener('timeupdate', tick);

    return () => {
      PlayerService.getAudio().removeEventListener('timeupdate', tick);
    };
  }, [tick]);

  return currentTime;
}
