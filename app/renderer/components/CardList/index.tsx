import { Virtuoso } from 'react-virtuoso';
import MediaCard from '@renderer/components/MediaCard';
import { TrackModel } from '@shared/types/vimp';

interface CardListProps {
  data: TrackModel[];
  max: number;
}

export default function CardList({ data, max }: CardListProps) {
  const items = data.slice(0, max);

  return (
    <div className='rounded-lg'>
      <Virtuoso
        data={items}
        horizontalDirection
        itemContent={(index, item) => (
          <div className='pr-6'>
            <MediaCard key={item._id} item={item} queue={data} />
          </div>
        )}
        style={{
          height: 310,
        }}
      />
    </div>
  );
}
