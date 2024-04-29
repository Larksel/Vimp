import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/componentes/ui/card';
import InfoText from '../InfoText/InfoText';

import { Play } from '@phosphor-icons/react';

import placeholder from '../../assets/images/placeholder.png';
import { Track } from '../../../shared/types/vimp';
import player from '../../lib/player';
import { formatDuration } from '@/lib/utils';

interface MediaCardProps {
  item: Track;
}

export default function MediaCard({ item }: MediaCardProps) {
  const [cover, setCover] = useState('');

  useEffect(() => {
    setCover(item.cover);
  }, [item.cover]);

  const playTrack = () => {
    player.setTrack(item);
    player.play();
  };

  return (
    <Card
      onClick={playTrack}
      className='group flex h-72 w-52 flex-col space-y-2 overflow-hidden p-4 transition-all duration-300 hover:cursor-pointer hover:bg-neutral-700/70'
    >
      <CardHeader className='relative space-y-0 p-0'>
        <button className='absolute bottom-0 right-2 flex size-10 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-sm transition-all duration-300 group-hover:bottom-2 group-hover:opacity-100'>
          <Play weight='fill' size={20} />
        </button>
        <img
          src={cover || placeholder}
          className='aspect-square w-full select-none rounded object-cover'
        />
      </CardHeader>
      <CardContent className='overflow-hidden p-0'>
        <InfoText variant='primary'>{item.title}</InfoText>
        <InfoText variant='secondary'>{item.artist}</InfoText>
      </CardContent>
      <p className='text-right text-sm text-zinc-400'>
        {formatDuration(item.duration)}
      </p>
    </Card>
  );
}
