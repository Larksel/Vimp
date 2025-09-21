import { SpeakerSimpleHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleHigh';
import { SpeakerSimpleLowIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleLow';
import { SpeakerSimpleXIcon } from '@phosphor-icons/react/dist/csr/SpeakerSimpleX';

import { Button } from '@renderer/components/common/button';
import { Slider } from '@renderer/components/common/slider';

import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';

export default function VolumeControl() {
  const playerAPI = usePlayerAPI();

  const isPlayerMuted = usePlayerStore((state) => state.isPlayerMuted);
  const volume = usePlayerStore((state) => state.volume);

  const handleVolumeChange = (value: number) => {
    if (isPlayerMuted) {
      playerAPI.setIsMuted(false);
    }
    playerAPI.setVolume(value);
  };

  const volumeIcons = () => {
    if (volume === 0 || isPlayerMuted) {
      return <SpeakerSimpleXIcon size={24} />;
    } else if (volume < 0.5) {
      return <SpeakerSimpleLowIcon size={24} />;
    } else {
      return <SpeakerSimpleHighIcon size={24} />;
    }
  };

  return (
    <div className='flex flex-row items-center justify-center gap-2'>
      <Button
        onClick={() => playerAPI.setIsMuted(!isPlayerMuted)}
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
