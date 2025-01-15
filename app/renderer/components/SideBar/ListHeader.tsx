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
    <div className='z-10 flex w-full items-center justify-between gap-1 bg-[#121212] px-2 py-1 transition-all'>
      <Button
        variant='ghost'
        className={`flex aspect-square rounded-full p-0 text-neutral-400 transition-all hover:scale-110 hover:bg-transparent hover:text-white ${collapsed ? 'mx-1' : ''}`}
      >
        <Plus size={20} />
      </Button>

      <div
        className={`flex items-center ${collapsed ? 'w-0 overflow-clip' : 'w-full'}`}
      >
        <SearchBox
          name='search-playlist'
          canChangeVisibility={true}
          onSearch={searchHandler}
        />
      </div>

      <Button
        variant='ghost'
        className={`flex aspect-square rounded-full p-0 text-neutral-400 transition-all hover:scale-110 hover:bg-transparent hover:text-white ${collapsed ? 'w-0 overflow-clip' : ''}`}
      >
        <ListBullets size={20} />
      </Button>
    </div>
  );
}
