import { Plus, ListBullets } from '@phosphor-icons/react';
import { Button } from '@components/common/button';
import SearchBox from '@components/SearchBox';

interface ListHeaderProps {
  collapsed: boolean;
  searchHandler: (search: string) => void;
}

export default function ListHeader(props: ListHeaderProps) {
  const { collapsed, searchHandler } = props;

  return (
    <div className='z-10 flex h-12 w-full items-center justify-between gap-1 px-2 py-1 transition-all'>
      <Button
        variant='surface'
        className={`text-text-secondary hover:text-text-primary flex aspect-square rounded-full p-0 transition-all ${collapsed ? 'mx-1' : ''}`}
      >
        <Plus size={20} />
      </Button>

      <div
        className={`flex h-full items-center ${collapsed ? 'w-0 overflow-clip' : 'w-full'}`}
      >
        <SearchBox
          name='search-playlist'
          canChangeVisibility={true}
          onSearch={searchHandler}
        />
      </div>

      <Button
        variant='surface'
        className={`text-text-secondary hover:text-text-primary flex aspect-square rounded-full p-0 transition-all ${collapsed ? 'w-0 overflow-clip' : ''}`}
      >
        <ListBullets size={20} />
      </Button>
    </div>
  );
}
