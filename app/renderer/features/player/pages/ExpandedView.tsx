import placeholder from '@renderer/assets/images/placeholder.png';
import {
  AudioVisualizer,
  useAudioAnimation,
} from '@renderer/features/audioReaction';
import { useCurrentTrack } from '@renderer/features/player';
import { useRef } from 'react';

export default function ExpandedView() {
  const track = useCurrentTrack();
  const imgRef = useRef<HTMLImageElement>(null);

  useAudioAnimation([imgRef], (audioData) => {
    const brightness = 0.3 + audioData.bass * 0.2;
    const blur = 4 + audioData.bass * 2;
    const scale = 1 + audioData.bass * 0.015;

    return {
      transform: `scale(${scale})`,
      filter: `brightness(${brightness}) blur(${blur}px)`,
    };
  });

  return (
    <div
      className={`bg-background relative flex items-center justify-center overflow-clip p-4 pl-72 transition-all`}
    >
      <div className='z-10 h-64 w-full self-end'>
        <AudioVisualizer />
      </div>
      <img
        ref={imgRef}
        src={track?.cover ?? placeholder}
        alt=''
        className='absolute inset-0 size-full object-cover blur-md brightness-30'
      />
      <img
        src={track?.cover ?? placeholder}
        alt=''
        className={`absolute bottom-4 left-4 size-64 rounded-lg object-cover shadow-md transition-all`}
      />
    </div>
  );
}
