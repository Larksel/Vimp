import { useState } from 'react';
import { HeartStraight } from '@phosphor-icons/react';

import placeholderImage from '@assets/images/placeholder.png';
import useCurrentTrack from '@hooks/useCurrentTrack';

import ExpandedView from './ExpandedView';
import InfoText from '@components/InfoText';
import { Button } from '@components/common/button';
import { usePlayerAPI } from '@stores/usePlayerStore';

export default function MusicInfo() {
  const playerAPI = usePlayerAPI();
  const [visible, setVisible] = useState(false);
  const track = useCurrentTrack();

  const toggleVisible = () => {
    setVisible(!visible);
  };

  const toggleFavorite = async () => {
    if (!track) return;
    playerAPI.toggleFavorite(track._id);
  };

  return (
    <>
      <ExpandedView visible={visible} />
      <div className='flex h-full w-[30%] items-center'>
        <div
          onClick={toggleVisible}
          className={`flex h-full w-full select-none items-center ${visible ? 'gap-0' : 'gap-2'} overflow-hidden rounded-lg p-2 transition-all hover:bg-white/20`}
        >
          <img
            src={track ? track.cover || placeholderImage : placeholderImage}
            alt=''
            className={`size-16 rounded-sm object-cover transition-all ${visible ? 'w-0 opacity-0' : ''}`}
          />

          <div
            className='flex w-full flex-col overflow-hidden whitespace-nowrap px-2'
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
            className='aspect-square shrink-0 rounded-full bg-transparent p-0'
            onClick={toggleFavorite}
          >
            <HeartStraight
              size={20}
              weight={`${track.favorite ? 'fill' : 'regular'}`}
              className={`${track.favorite ? 'text-red-500' : ''} transition-all`}
            />
          </Button>
        )}
      </div>
    </>
  );
}
