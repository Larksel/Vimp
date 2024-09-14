import { useState } from 'react';

import { Plus, MagnifyingGlass, ListBullets } from '@phosphor-icons/react';
import { Button } from '../common/button';
import { Input } from '../common/input';

interface ListHeaderProps {
  collapsed: boolean;
}

//TODO pesquisa de playlists
//TODO ordem

export default function ListHeader({ collapsed }: ListHeaderProps) {
  const [inputVisible, setInputVisible] = useState(false);
  const [search, setSearch] = useState('');

  const toggleVisibility = () => {
    if (inputVisible) {
      setSearch('');
    }

    setInputVisible(!inputVisible);
  };

  return (
    <div className='absolute z-10 flex w-full items-center justify-between gap-1 bg-[#121212] px-2 py-1 transition-all'>
      <Button
        variant='ghost'
        className={`flex aspect-square rounded-full p-0 text-neutral-400 transition-all hover:scale-110 hover:bg-transparent hover:text-white ${collapsed ? 'mx-1' : ''}`}
      >
        <Plus size={20} />
      </Button>

      <div
        className={`flex items-center ${collapsed ? 'w-0 overflow-clip' : 'w-full'}`}
      >
        <Button
          variant='ghost'
          onClick={toggleVisibility}
          className='flex aspect-square rounded-full p-0 text-neutral-400 transition-all hover:scale-110 hover:bg-transparent hover:text-white'
        >
          <MagnifyingGlass size={20} />
        </Button>

        <Input
          type='text'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          placeholder='Buscar'
          className={`${!inputVisible ? 'invisible w-0 p-0' : 'w-full opacity-100'} transition-all`}
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
