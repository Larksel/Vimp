import { Virtuoso } from 'react-virtuoso';
import { TrackModel } from '@shared/types/vimp';
import { ScrollArea } from '@renderer/components/common/scroll-area';
import TrackRow from './TrackRow';

interface TrackListProps {
  queue: TrackModel[];
  onItemClick: (trackID: string) => void;
  onScroll?: (scrollTop: number) => void;
}

export default function TrackList(props: TrackListProps) {
  const { queue, onItemClick, onScroll } = props;

  return (
    <div className='flex h-full flex-col items-center justify-start'>
      <div className='text-text-primary grid h-9 w-full grid-cols-[16px_6fr_4fr_3fr_1fr] gap-4 px-4 text-sm select-none'>
        <span className='flex items-center justify-center'>#</span>
        <span className='flex items-center'>Titulo</span>
        <span className='flex items-center'>Album</span>
        <span className='flex items-center justify-center'>Status</span>
        <span className='flex items-center justify-end'>Duração</span>
      </div>
      <div className='bg-surface-active h-[1px] w-full' />
      {queue.length > 0 ? (
        <Virtuoso
          components={{
            Scroller: ScrollArea,
          }}
          data={queue}
          className='w-full'
          overscan={5}
          itemContent={(index, track) => (
            <TrackRow
              key={`${index}-${track.title}`}
              index={index}
              track={track}
              onClick={(trackID) => onItemClick(trackID)}
            />
          )}
          onScroll={(e) => {
            if (!onScroll) return;
            const target = e.target as HTMLElement;
            onScroll(target.scrollTop);
          }}
        />
      ) : (
        <div className='text-text-secondary flex size-full items-center justify-center'>
          <p>Lista vazia</p>
        </div>
      )}
    </div>
  );
}
