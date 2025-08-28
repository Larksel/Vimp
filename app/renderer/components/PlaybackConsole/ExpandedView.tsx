import placeholder from '@renderer/assets/images/placeholder.png';
import AudioVisualizer from '@renderer/components/AudioVisualizer';
import useAudioData from '@renderer/hooks/useAudioData';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';
import { useEffect, useRef } from 'react';

interface ExpandedViewProps {
  visible: boolean;
}

export default function ExpandedView(props: ExpandedViewProps) {
  const { visible } = props;
  const track = useCurrentTrack();
  const audioDataRef = useAudioData();
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const animationLoop = () => {
      if (imgRef.current && audioDataRef.current) {
        const { rmsLevel } = audioDataRef.current;
        const brightness = 0.3 + rmsLevel * 0.2;
        const blur = 4 + rmsLevel * 2;
        const scale = 1 + rmsLevel * 0.015;

        imgRef.current.style.transform = `scale(${scale})`;
        imgRef.current.style.filter = `brightness(${brightness}) blur(${blur}px)`;
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    };
    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioDataRef]);

  return (
    <div
      className={`${visible ? 'top-0 opacity-100' : 'invisible top-full opacity-0'} bg-background absolute right-0 bottom-[80px] left-0 flex items-center justify-center p-4 pl-72 transition-all`}
    >
      {visible && (
        <div className='z-10 h-64 w-full self-end'>
          <AudioVisualizer />
        </div>
      )}
      <img
        ref={imgRef}
        src={track?.cover ?? placeholder}
        alt=''
        className='absolute inset-0 size-full object-cover blur-md brightness-30'
      />
      <img
        src={track?.cover ?? placeholder}
        alt=''
        className={`absolute left-4 size-64 rounded-lg object-cover shadow-md transition-all ${visible ? 'visible bottom-4' : 'invisible bottom-0'}`}
      />
    </div>
  );
}
