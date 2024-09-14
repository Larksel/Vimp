import { Slider } from '../common/slider';

import { formatDuration } from '../../utils/utils';
import { usePlayerAPI } from '@/stores/usePlayerStore';
import usePlayerCurrentTime from '@/hooks/usePlayerCurrentTime';
import useCurrentTrack from '@/hooks/useCurrentTrack';

export default function PlaybackTrack() {
  const currentTrack = useCurrentTrack();
  const playerAPI = usePlayerAPI();
  const songProgress = usePlayerCurrentTime();

  const handleProgressChange = (value: number) => {
    playerAPI.setSongProgress(value);
  };

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <p className='min-w-10 text-right text-xs text-neutral-500'>
        {formatDuration(songProgress)}
      </p>

      <Slider
        value={[songProgress]}
        min={0}
        max={currentTrack.duration}
        step={0.1}
        onValueChange={(value) => handleProgressChange(value[0])}
      />

      <p className='min-w-10 text-left text-xs text-neutral-500'>
        {formatDuration(currentTrack.duration)}
      </p>
    </div>
  );
}
