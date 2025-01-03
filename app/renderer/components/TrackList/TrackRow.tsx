import { formatDuration } from '@render-utils/utils';
import placeholder from '@assets/images/placeholder.png';
import { HeartStraight, PlayCircle } from '@phosphor-icons/react';
import { TrackModel } from '@shared/types/vimp';
import useCurrentTrack from '@hooks/useCurrentTrack';

interface TrackRowProps {
  track: TrackModel;
  index: number;
  onClick: (trackID: string) => void;
}

export default function TrackRow(props: TrackRowProps) {
  const { track, index, onClick } = props;
  const currentTrack = useCurrentTrack();
  const isPlaying = currentTrack ? track._id === currentTrack._id : false;

  return (
    <div
      onClick={() => onClick(track._id)}
      className={`grid h-16 w-full grid-cols-[16px,6fr,4fr,3fr,1fr] items-center gap-4 rounded-md px-4 text-sm tracking-normal hover:cursor-pointer hover:bg-neutral-700/70 ${isPlaying ? 'bg-white/10 text-green-500' : 'text-neutral-400'}`}
    >
      <span className='flex items-center justify-center'>{index + 1}</span>

      <div className='flex h-full items-center gap-3 truncate'>
        <img
          src={track.cover || placeholder}
          alt=''
          className='size-12 shrink-0 rounded object-cover'
        />

        <div className='flex h-full w-full flex-col justify-center truncate'>
          <span
            className={`truncate ${isPlaying ? 'text-green-500' : 'text-white'}`}
          >
            {track.title}
          </span>
          <span className='text-xs text-neutral-400'>{track.artist[0]}</span>
        </div>
      </div>

      <span className='flex h-full items-center truncate'>{track.album}</span>

      <div className='grid h-full grid-cols-2 items-center justify-items-center'>
        {track.favorite ? (
          <HeartStraight weight='fill' size={20} />
        ) : (
          <HeartStraight size={20} />
        )}
        <span className='flex items-center justify-start gap-1 justify-self-start'>
          <PlayCircle size={20} />
          <span>{track.playCount}</span>
        </span>
      </div>

      <span className='flex items-center justify-end'>
        {formatDuration(track.duration)}
      </span>
    </div>
  );
}
