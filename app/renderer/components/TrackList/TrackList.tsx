import { Virtuoso } from 'react-virtuoso';
import { TrackModel } from '../../../shared/types/vimp';
import { ScrollArea } from '@components/common/scroll-area';
import TrackRow from './TrackRow';

interface TrackListProps {
  queue: TrackModel[];
  onItemClick: (trackID: string) => void;
}

//TODO opção de remover track da lista
export default function TrackList(props: TrackListProps) {
  const { queue, onItemClick } = props;

  return (
    <div className='flex h-full flex-col items-center justify-start'>
      <div className='grid h-9 w-full grid-cols-[16px,6fr,4fr,3fr,1fr] gap-4 px-4 text-sm text-neutral-300'>
        <span className='flex items-center justify-center'>#</span>
        <span className='flex items-center'>Titulo</span>
        <span className='flex items-center'>Album</span>
        <span className='flex items-center justify-center'>Status</span>
        <span className='flex items-center justify-end'>Duração</span>
      </div>
      <div className='h-[1px] w-full bg-white/20' />
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
        />
      ) : (
        <div className='flex items-center justify-center pt-40 text-neutral-400'>
          Lista vazia
        </div>
      )}
    </div>
  );
}
