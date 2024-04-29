import MediaCard from './MediaCard';

import { Track } from '../../../shared/types/vimp';

type CardListProps = {
  data: Track[];
}

//TODO Grid
export default function CardList({ data }: CardListProps) {
  return (
    <div className='flex gap-6 py-3 h-full w-full overflow-auto'>
      {data.map((item, index) => (
        <MediaCard
          key={index}
          item={item}
        />
      ))}
    </div>
  );
}
