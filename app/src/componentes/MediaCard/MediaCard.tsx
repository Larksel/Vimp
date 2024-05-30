import { Card, CardContent, CardHeader } from '@/componentes/ui/card';
import InfoText from '../InfoText/InfoText';

import { Play } from '@phosphor-icons/react';

import placeholder from '../../assets/images/placeholder.png';
import { TrackModel } from '../../../shared/types/vimp';
import { formatDuration } from '@/lib/utils';
import { usePlayerAPI } from '@/stores/usePlayerStore';

interface MediaCardProps {
  item: TrackModel;
}

export default function MediaCard({ item }: MediaCardProps) {
  const playerAPI = usePlayerAPI();

  const playTrack = () => {
    playerAPI.start([item]);
  };

  return (
    <Card
      onClick={playTrack}
      className='group relative flex h-72 w-56 flex-col space-y-2 overflow-hidden border-neutral-700/50 bg-neutral-800 p-4 transition-all duration-300 hover:cursor-pointer hover:bg-neutral-700/70'
    >
      <CardHeader className='relative space-y-0 p-0'>
        <button className='absolute bottom-0 right-2 flex size-10 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-sm transition-all duration-300 group-hover:bottom-2 group-hover:opacity-100'>
          <Play weight='fill' size={20} />
        </button>
        <img
          src={item.cover || placeholder}
          className='aspect-square w-full select-none rounded object-cover'
        />
      </CardHeader>
      <CardContent className='overflow-hidden p-0'>
        <InfoText variant='primary'>{item.title}</InfoText>
        <InfoText variant='secondary'>{item.artist}</InfoText>
      </CardContent>
      <p className='absolute bottom-4 right-4 w-fit text-sm text-neutral-400'>
        {formatDuration(item.duration)}
      </p>
    </Card>
  );
}
