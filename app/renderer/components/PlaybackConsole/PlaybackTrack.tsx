import { Slider } from '@renderer/components/common/slider';

import { formatDuration } from '@renderer/utils/utils';
import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';
import useMediaSession from '@renderer/hooks/useMediaSession';
import useAudioRMS from '@renderer/hooks/useAudioRMS';

export default function PlaybackTrack() {
  const currentTrack = useCurrentTrack();
  const playerAPI = usePlayerAPI();
  const currentTime = usePlayerStore((state) => state.currentTime);
  useMediaSession();
  useAudioRMS();

  const handleProgressChange = (value: number) => {
    playerAPI.seekTo(value);
  };

  return (
    <div className='flex w-full flex-row items-center justify-between gap-3'>
      <p className='text-text-secondary min-w-10 text-right text-xs'>
        {formatDuration(currentTime)}
      </p>

      <Slider
        value={[currentTime]}
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
