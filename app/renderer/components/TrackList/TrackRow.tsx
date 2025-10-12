import { formatDuration } from '@renderer/utils/utils';
import placeholder from '@renderer/assets/images/placeholder.png';
import { HeartStraightIcon } from '@phosphor-icons/react/dist/csr/HeartStraight';
import { PlayCircleIcon } from '@phosphor-icons/react/dist/csr/PlayCircle';
import { TrackModel } from '@shared/types/vimp';
import { useCurrentTrack } from '@renderer/features/player';
import TrackMenu from '@renderer/components/ContextMenu/TrackMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TrackRowProps {
  track: TrackModel;
  index: number;
  isSelected: boolean;
  onClick: (trackID: string) => void;
}

export default function TrackRow(props: TrackRowProps) {
  const { track, index, isSelected, onClick } = props;
  const currentTrack = useCurrentTrack();
  const isPlaying = currentTrack ? track._id === currentTrack._id : false;
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: track._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <TrackMenu track={track}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => onClick(track._id)}
        className={`hover:bg-surface-highlight active:bg-surface-active grid h-16 w-full grid-cols-[16px_6fr_4fr_3fr_1fr] items-center gap-4 px-4 text-sm tracking-normal select-none hover:cursor-pointer ${isPlaying ? 'bg-surface-highlight text-accent' : 'text-text-secondary'} ${isSelected && 'bg-surface-active'}`}
      >
        <span className='flex items-center justify-center'>{index + 1}</span>

        <div className='flex h-full items-center gap-3 truncate'>
          <img
            src={track.cover ?? placeholder}
            alt=''
            className='size-12 shrink-0 rounded-sm object-cover'
          />

          <div className='flex h-full w-full flex-col justify-center truncate'>
            <span
              className={`truncate ${isPlaying ? 'text-accent' : 'text-text-primary'}`}
            >
              {track.title}
            </span>
            <span className='text-text-secondary text-xs'>
              {track.artist[0]}
            </span>
          </div>
        </div>

        <span className='flex h-full items-center truncate'>{track.album}</span>

        <div className='grid h-full grid-cols-2 items-center justify-items-center'>
          {track.favorite ? (
            <HeartStraightIcon weight='fill' size={20} />
          ) : (
            <HeartStraightIcon size={20} />
          )}
          <span className='flex items-center justify-start gap-1 justify-self-start'>
            <PlayCircleIcon size={20} />
            <span>{track.playCount}</span>
          </span>
        </div>

        <span className='flex items-center justify-end'>
          {formatDuration(track.duration)}
        </span>
      </div>
    </TrackMenu>
  );
}
