import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import MediaCard from '@components/MediaCard';

import { TrackModel } from '@shared/types/vimp';

interface CardListProps {
  data: TrackModel[];
  max: number;
}

export default function CardList(props: CardListProps) {
  const { data, max } = props;

  return (
    <ScrollArea className='rounded-lg'>
      <div className='flex gap-6 pb-1'>
        {data.slice(0, max).map((item) => (
          <MediaCard key={item._id} item={item} queue={data} />
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
