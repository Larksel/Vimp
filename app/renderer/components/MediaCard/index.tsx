import InfoText from '@components/InfoText';

import { Play } from '@phosphor-icons/react';

import placeholder from '@assets/images/placeholder.png';
import { TrackModel } from '@shared/types/vimp';
import { formatDuration } from '@render-utils/utils';
import { usePlayerAPI } from '@stores/usePlayerStore';
import TrackMenu from '@components/ContextMenu/TrackMenu';

interface MediaCardProps {
  item: TrackModel;
  queue: TrackModel[];
}

export default function MediaCard(props: MediaCardProps) {
  const { item, queue } = props;
  const playerAPI = usePlayerAPI();

  const playTrack = () => {
    playerAPI.startPlayback(queue, item._id);
  };

  return (
    <TrackMenu track={item}>
      <div
        onClick={playTrack}
        className='group bg-elevated-base hover:bg-elevated-highlight active:bg-elevated-active relative flex h-72 w-56 flex-col space-y-2 overflow-hidden rounded-lg p-4 shadow-xs transition-all duration-300 hover:cursor-pointer'
      >
        <div className='relative'>
          <div className='bg-accent absolute right-2 bottom-0 flex size-10 items-center justify-center rounded-full opacity-0 shadow-xs transition-all duration-300 group-hover:bottom-2 group-hover:opacity-100'>
            <Play weight='fill' size={20} />
          </div>
          <img
            src={item.cover ?? placeholder}
            alt=''
            className='aspect-square w-full rounded-sm object-cover select-none'
          />
        </div>
        <div className='overflow-hidden p-0'>
          <InfoText variant='primary'>{item.title}</InfoText>
          <InfoText variant='secondary'>{item.artist[0]}</InfoText>
        </div>
        <p className='text-text-secondary absolute right-4 bottom-4 w-fit text-sm'>
          {formatDuration(item.duration)}
        </p>
      </div>
    </TrackMenu>
  );
}
