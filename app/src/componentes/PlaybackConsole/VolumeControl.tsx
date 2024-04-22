import { useSelector } from 'react-redux';

import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleNone,
  SpeakerSimpleX,
} from '@phosphor-icons/react';

import { Slider } from '../ui/slider';

import { selectVolume, selectIsMuted } from '../../features/playerSlice';
import player from '../../lib/player';

//TODO indicador com o volume atual

export default function VolumeControl() {
  const volume = useSelector(selectVolume);
  const isMuted = useSelector(selectIsMuted);

  const handleMute = () => {
    if (!isMuted) {
      player.mute();
    } else {
      player.unmute();
    }
  };

  const handleVolumeChange = (value: number) => {
    if (isMuted) {
      player.unmute();
    }
    player.setVolume(value);
  };

  const volumeIcons = () => {
    if (volume === 0 || isMuted) {
      return <SpeakerSimpleX size={24} />;
    } else if (volume >= 1 && volume <= 33) {
      return <SpeakerSimpleNone size={24} />;
    } else if (volume >= 34 && volume <= 66) {
      return <SpeakerSimpleLow size={24} />;
    } else {
      return <SpeakerSimpleHigh size={24} />;
    }
  };

  return (
    <div className='flex flex-row items-center justify-center gap-2'>
      <button
        onClick={handleMute}
        className='text-zinc-400 transition-colors hover:text-zinc-100'
      >
        {volumeIcons()}
      </button>

      <Slider
        value={[volume]}
        onValueChange={(value) => handleVolumeChange(value[0])}
        min={0}
        max={100}
        step={1}
        className='w-[100px]'
      />
    </div>
  );
}
