import { Track } from '../../../shared/types/vimp';
import { formatDuration } from '../../lib/utils';

import player from '../../lib/player';
import placeholder from '@/assets/images/placeholder.png';

interface TrackProps {
  track: Track;
}

export default function TrackItem({ track }: TrackProps) {
  const playTrack = () => {
    player.setTrack(track);
    player.play();
  };

  return (
    <div
      className='flex w-52 cursor-pointer select-none flex-col overflow-clip rounded-md bg-neutral-900 p-4 transition-colors hover:bg-black/70'
      onClick={playTrack}
    >
      <div className='mb-2 flex items-center justify-center'>
        <img
          src={track.cover || placeholder}
          className='size-40 shrink-0 rounded object-cover'
        />
      </div>
      <p className='flex-1 text-base'>{track.title}</p>
      <p className='text-right text-sm text-neutral-400'>
        {formatDuration(track.duration)}
      </p>
    </div>
  );
}
