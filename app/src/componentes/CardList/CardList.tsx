import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import MediaCard from '../MediaCard/MediaCard';

import { TrackModel } from '../../../shared/types/vimp';

type CardListProps = {
  data: TrackModel[];
  max: number
};

export default function CardList({ data, max }: CardListProps) {
  return (
    <ScrollArea className='rounded-lg'>
      <div className='flex gap-6 pb-1'>
        {data.slice(0, max).map((item, index) => (
          <MediaCard key={index} item={item} queue={data} />
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
