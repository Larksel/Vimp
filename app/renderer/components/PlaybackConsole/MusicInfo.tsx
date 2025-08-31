import { useEffect, useRef, useState } from 'react';
import { HeartStraightIcon } from '@phosphor-icons/react/dist/csr/HeartStraight';

import placeholderImage from '@renderer/assets/images/placeholder.png';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';

import ExpandedView from './ExpandedView';
import InfoText from '@renderer/components/InfoText';
import { Button } from '@renderer/components/common/button';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import useAudioData from '@renderer/hooks/useAudioData';

export default function MusicInfo() {
  const playerAPI = usePlayerAPI();
  const [visible, setVisible] = useState(false);
  const track = useCurrentTrack();
  const audioDataRef = useAudioData();
  const heartIconRef = useRef<SVGSVGElement>(null);

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const toggleFavorite = async () => {
    if (!track) return;
    playerAPI.toggleTrackFavorite(track._id);
  };

  useEffect(() => {
    let animationFrameId: number;

    const animationLoop = () => {
      if (heartIconRef.current && audioDataRef.current) {
        const { bass } = audioDataRef.current;
        const brightness = 0.7 + bass * 0.3;
        const scale = 1 + bass * 0.3;

        heartIconRef.current.style.transform = `scale(${scale})`;
        heartIconRef.current.style.filter = `brightness(${brightness})`;
      }
      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioDataRef]);

  return (
    <>
      <ExpandedView visible={visible} />
      <div className='flex h-full w-[30%] items-center'>
        <div
          onClick={toggleVisible}
          className={`flex h-full w-full items-center select-none ${visible ? 'gap-0' : 'gap-2'} hover:bg-surface-highlight overflow-hidden rounded-lg p-2 transition-all`}
        >
          <img
            src={track?.cover ?? placeholderImage}
            alt=''
            className={`size-16 rounded-sm object-cover transition-all ${visible ? 'w-0 opacity-0' : ''}`}
          />

          <div
            className='flex w-full flex-col overflow-hidden px-2 whitespace-nowrap'
            style={{
              maskImage:
                'linear-gradient(90deg,transparent 0,#000 8px,#000 calc(100% - 12px),transparent)',
            }}
          >
            {track ? (
              <>
                <InfoText variant='primary'>{track.title}</InfoText>
                <InfoText variant='secondary'>{track.artist[0]}</InfoText>
              </>
            ) : (
              <InfoText variant='primary'>Nenhuma música selecionada</InfoText>
            )}
          </div>
        </div>
        {track && (
          <Button
            variant={'glass'}
            className='mx-2 aspect-square size-6 shrink-0 rounded-full p-0'
            onClick={toggleFavorite}
          >
            <HeartStraightIcon
              ref={heartIconRef}
              size={24}
              weight={`${track.favorite ? 'fill' : 'regular'}`}
              className={`${track.favorite && 'text-red-500'}`}
            />
          </Button>
        )}
      </div>
    </>
  );
}
