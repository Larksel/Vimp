import { Slider } from '@renderer/components/common/slider';

import { formatDuration } from '@renderer/utils/utils';
import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useCurrentTrack, useMediaSession } from '@renderer/features/player';

export default function PlaybackTrack() {
  const currentTrack = useCurrentTrack();
  const playerAPI = usePlayerAPI();
  const currentTime = usePlayerStore((state) => state.currentTime);
  useMediaSession();

  const handleProgressChange = (value: number) => {
    playerAPI.seekTo(value);
  };

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <p className='text-text-secondary min-w-10 text-right text-xs select-none'>
        {formatDuration(currentTime)}
      </p>

      <Slider
        value={[currentTime]}
        min={0}
        max={currentTrack ? currentTrack.duration : 0}
        step={0.1}
        onValueChange={(value) => handleProgressChange(value[0])}
      />

      <p className='text-text-secondary min-w-10 text-left text-xs select-none'>
        {formatDuration(currentTrack ? currentTrack.duration : 0)}
      </p>
    </div>
  );
}
