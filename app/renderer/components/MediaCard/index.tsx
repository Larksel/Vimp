import { Card, CardContent, CardHeader } from '@components/common/card';
import InfoText from '@components/InfoText';

import { Play } from '@phosphor-icons/react';

import placeholder from '@assets/images/placeholder.png';
import { TrackModel } from '@shared/types/vimp';
import { formatDuration } from '@render-utils/utils';
import { usePlayerAPI } from '@stores/usePlayerStore';

interface MediaCardProps {
  item: TrackModel;
  queue: TrackModel[];
}

export default function MediaCard(props: MediaCardProps) {
  const { item, queue } = props;
  const playerAPI = usePlayerAPI();

  const playTrack = () => {
    playerAPI.start(queue, item._id);
  };

  return (
    <Card
      onClick={playTrack}
      className='group relative flex h-72 w-56 flex-col space-y-2 overflow-hidden border-0 bg-[#181818] p-4 transition-all duration-300 hover:cursor-pointer hover:bg-neutral-800'
    >
      <CardHeader className='relative space-y-0 p-0'>
        <button className='absolute bottom-0 right-2 flex size-10 items-center justify-center rounded-full bg-green-500 opacity-0 shadow-sm transition-all duration-300 group-hover:bottom-2 group-hover:opacity-100'>
          <Play weight='fill' size={20} />
        </button>
        <img
          src={item.cover || placeholder}
          alt=''
          className='aspect-square w-full select-none rounded object-cover'
        />
      </CardHeader>
      <CardContent className='overflow-hidden p-0'>
        <InfoText variant='primary'>{item.title}</InfoText>
        <InfoText variant='secondary'>{item.artist[0]}</InfoText>
      </CardContent>
      <p className='absolute bottom-4 right-4 w-fit text-sm text-neutral-400'>
        {formatDuration(item.duration)}
      </p>
    </Card>
  );
}
