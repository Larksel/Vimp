import { useState } from 'react';

import placeholderImage from '../../assets/images/placeholder.png';
import useCurrentTrack from '@/hooks/useCurrentTrack';

import ExpandedView from './ExpandedView';
import InfoText from '../InfoText/InfoText';

export default function MusicInfo() {
  const [visible, setVisible] = useState(false);
  const track = useCurrentTrack();

  const toggleVisible = () => {
    setVisible(!visible);
  };

  return (
    <>
      <ExpandedView visible={visible} />
      <div
        onClick={toggleVisible}
        className={`flex w-[30%] select-none items-center ${visible ? 'gap-0' : 'gap-2'} rounded-lg p-2 transition-all hover:bg-white/20`}
      >
        <img
          src={track.cover || placeholderImage}
          className={`size-16 rounded object-cover transition-all ${visible ? 'w-0 opacity-0' : ''}`}
        />

        <div
          className='flex w-full flex-col overflow-hidden whitespace-nowrap px-2'
          style={{
            maskImage:
              'linear-gradient(90deg,transparent 0,#000 8px,#000 calc(100% - 12px),transparent)',
          }}
        >
          <InfoText variant='primary'>{track.title}</InfoText>
          <InfoText variant='secondary'>{track.artist}</InfoText>
        </div>
      </div>
    </>
  );
}
