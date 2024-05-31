import { TrackModel } from '../../../shared/types/vimp';
import TrackRow from './TrackRow';

interface TrackListProps {
  queue: TrackModel[];
  queuePosition: number | null;
}

export default function TrackList(props: TrackListProps) {
  const { queue, queuePosition } = props;

  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='grid h-9 w-full grid-cols-[16px,6fr,4fr,3fr,1fr] gap-4 px-4 text-sm text-neutral-300'>
        <span className='flex items-center justify-center'>#</span>
        <span className='flex items-center'>Titulo</span>
        <span className='flex items-center'>Album</span>
        <span className='flex items-center justify-center'>Status</span>
        <span className='flex items-center justify-end'>Duração</span>
      </div>
      <div className='h-[1px] w-full bg-white/20' />
      {queue.length > 0 ? (
        queue.map((track, index) => (
          <TrackRow
            key={`${index}-${track.title}`}
            track={track}
            queue={queue}
            queuePosition={queuePosition}
            index={index}
          />
        ))
      ) : (
        <div className='flex h-80 items-center justify-center text-neutral-400'>
          Lista vazia
        </div>
      )}
    </div>
  );
}
