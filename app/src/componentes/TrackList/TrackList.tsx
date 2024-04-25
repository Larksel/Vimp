import { Track } from '../../../shared/types/vimp';

import TrackItem from './TrackItem';

interface TrackListProps {
  data: Track[];
}

export default function TrackList({ data }: TrackListProps) {
  return (
    <div className='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4'>
      {data.map((track, index) => (
        <TrackItem key={index} track={track} />
      ))}
    </div>
  );
}
