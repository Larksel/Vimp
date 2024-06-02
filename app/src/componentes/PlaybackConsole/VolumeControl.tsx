import {
  SpeakerSimpleHigh,
  SpeakerSimpleLow,
  SpeakerSimpleNone,
  SpeakerSimpleX,
} from '@phosphor-icons/react';

import { Slider } from '../ui/slider';

import usePlayerStore, { usePlayerAPI } from '@/stores/usePlayerStore';

//TODO indicador com o volume atual
//TODO https://www.dr-lex.be/info-stuff/volumecontrols.html#about
export default function VolumeControl() {
  const playerAPI = usePlayerAPI();
  const volume = usePlayerStore((state) => state.volume);
  const isMuted = usePlayerStore((state) => state.isMuted);

  const handleVolumeChange = (value: number) => {
    if (isMuted) {
      playerAPI.setIsMuted(false);
    }
    playerAPI.setVolume(value);
  };

  const volumeIcons = () => {
    if (volume === 0 || isMuted) {
      return <SpeakerSimpleX size={24} />;
    } else if (volume < 50) {
      return <SpeakerSimpleLow size={24} />;
    } else {
      return <SpeakerSimpleHigh size={24} />;
    }
  };

  return (
    <div className='flex flex-row items-center justify-center gap-2'>
      <button
        onClick={() => playerAPI.setIsMuted(!isMuted)}
        className='text-neutral-400 transition-colors hover:text-neutral-100'
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
