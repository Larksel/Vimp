import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import MediaCard from './MediaCard';

import { Track } from '../../../shared/types/vimp';

type CardListProps = {
  data: Track[];
};

//TODO Grid
export default function CardList({ data }: CardListProps) {
  return (
    <ScrollArea className='rounded-lg'>
      <div className='flex space-x-6 pb-1'>
        {data.map((item, index) => (
          <MediaCard key={index} item={item} />
        ))}
      </div>
      <ScrollBar orientation='horizontal' />
    </ScrollArea>
  );
}
