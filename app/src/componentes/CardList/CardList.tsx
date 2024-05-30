import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import MediaCard from '../MediaCard/MediaCard';

import { TrackModel } from '../../../shared/types/vimp';

type CardListProps = {
  data: TrackModel[];
};

export default function CardList({ data }: CardListProps) {
  return (
    <ScrollArea className='rounded-lg'>
      <div className='flex gap-6 pb-1'>
        {data.map((item, index) => (
          <MediaCard key={index} item={item} queue={data} />
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
