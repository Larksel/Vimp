import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleX,
} from '@phosphor-icons/react';

import { Button } from '@components/common/button';
import { Slider } from '@components/common/slider';

import usePlayerStore, { usePlayerAPI } from '@stores/usePlayerStore';
import { useState } from 'react';
import player from '@features/player';

export default function VolumeControl() {
  const playerAPI = usePlayerAPI();
  const audio = player.getAudio();

  const isMuted = usePlayerStore((state) => state.isMuted);
  const [volume, setVolume] = useState(audio.volume);

  const handleVolumeChange = (value: number) => {
    if (isMuted) {
      playerAPI.setIsMuted(false);
    }
    playerAPI.setVolume(value);
    setVolume(value);
  };

  const volumeIcons = () => {
    if (volume === 0 || isMuted) {
      return <SpeakerSimpleX size={24} />;
    } else if (volume < 0.5) {
      return <SpeakerSimpleLow size={24} />;
    } else {
      return <SpeakerSimpleHigh size={24} />;
    }
  };

  return (
    <div className='flex flex-row items-center justify-center gap-2'>
      <Button
        onClick={() => playerAPI.setIsMuted(!isMuted)}
        variant={'glass'}
        className='aspect-square size-6 rounded-full p-0'
      >
        {volumeIcons()}
      </Button>

      <Slider
        value={[volume]}
        onValueChange={(value) => handleVolumeChange(value[0])}
        min={0}
        max={1}
        step={0.01}
        className='w-[100px]'
      />
    </div>
  );
}
