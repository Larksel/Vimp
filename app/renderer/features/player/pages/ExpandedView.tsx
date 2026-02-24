import placeholder from '@renderer/assets/images/placeholder.png';
import { Button } from '@renderer/components/common';
import {
  AudioVisualizer,
  VisualizerScene,
  useAudioAnimation,
} from '@renderer/features/audioReaction';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';
import { useRef, useState } from 'react';

export default function ExpandedView() {
  const track = useCurrentTrack();
  const imgRef = useRef<HTMLImageElement>(null);
  const [type, setType] = useState<'circle' | 'wave'>('circle');

  useAudioAnimation([imgRef], (audioData) => {
    const brightness = 0.3 + audioData.bass * 0.2;
    const blur = 4 + audioData.bass * 2;
    const scale = 1 + audioData.bass * 0.015;

    return {
      transform: `scale(${scale})`,
      filter: `brightness(${brightness}) blur(${blur}px)`,
    };
  });

  const handleChangeVisualizer = () => {
    if (type === 'circle') setType('wave');
    else setType('circle');
  };

  return (
    <div className={`bg-background relative flex overflow-clip transition-all`}>
      <img
        ref={imgRef}
        src={track?.cover ?? placeholder}
        alt=''
        className='absolute inset-0 size-full object-cover blur-md brightness-30'
      />
      <Button
        variant={'glass'}
        className='absolute bottom-0 z-10'
        onClick={handleChangeVisualizer}
      >
        {type}
      </Button>
      {type === 'circle' && <VisualizerScene />}
      {type === 'wave' && (
        <>
          <img
            src={track?.cover ?? placeholder}
            alt=''
            className={`absolute bottom-4 left-4 size-64 rounded-lg object-cover shadow-md transition-all`}
          />
          <div className='z-10 mb-4 ml-68 h-64 w-full self-end'>
            <AudioVisualizer />
          </div>
        </>
      )}
    </div>
  );
}
