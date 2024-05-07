import { useSelector } from 'react-redux';

import { Slider } from '../ui/slider';

import {
  selectSongDuration,
  selectSongProgress,
} from '../../features/playerSlice';
import { formatDuration } from '../../lib/utils';
import player from '../../lib/player';

export default function PlaybackTrack() {
  const songDuration = useSelector(selectSongDuration);
  const songProgress = useSelector(selectSongProgress);

  const handleProgressChange = (value: number) => {
    player.setCurrentTime(value);
  };

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <p className='min-w-10 text-right text-xs text-neutral-500'>
        {formatDuration(songProgress)}
      </p>

      <Slider
        value={[songProgress]}
        min={0}
        max={songDuration}
        step={0.1}
        onValueChange={(value) => handleProgressChange(value[0])}
      />

      <p className='min-w-10 text-left text-xs text-neutral-500'>
        {formatDuration(songDuration)}
      </p>
    </div>
  );
}
