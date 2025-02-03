import { Slider } from '@components/common/slider';

import { formatDuration } from '@render-utils/utils';
import { usePlayerAPI } from '@stores/usePlayerStore';
import usePlayerCurrentTime from '@hooks/usePlayerCurrentTime';
import useCurrentTrack from '@hooks/useCurrentTrack';

export default function PlaybackTrack() {
  const currentTrack = useCurrentTrack();
  const playerAPI = usePlayerAPI();
  const songProgress = usePlayerCurrentTime();

  const handleProgressChange = (value: number) => {
    playerAPI.setSongProgress(value);
  };

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <p className='text-text-secondary min-w-10 text-right text-xs'>
        {formatDuration(songProgress)}
      </p>

      <Slider
        value={[songProgress]}
        min={0}
        max={currentTrack ? currentTrack.duration : 0}
        step={0.1}
        onValueChange={(value) => handleProgressChange(value[0])}
      />

      <p className='text-text-secondary min-w-10 text-left text-xs'>
        {formatDuration(currentTrack ? currentTrack.duration : 0)}
      </p>
    </div>
  );
}
