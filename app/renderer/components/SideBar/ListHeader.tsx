import { Plus, ListBullets } from '@phosphor-icons/react';
import { Button } from '@components/common/button';
import SearchBox from '@components/SearchBox';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@components/common/popover';
import { Input } from '@components/common/input';
import { FormEvent, useState } from 'react';
import log from 'electron-log/renderer';
import { Playlist } from '@shared/types/vimp';
import { createGenericPlaylist } from '@shared/utils/utils';
import { PlaylistPersistenceService } from '@features/data';

interface ListHeaderProps {
  collapsed: boolean;
  searchHandler: (search: string) => void;
}

export default function ListHeader(props: ListHeaderProps) {
  const { collapsed, searchHandler } = props;
  const [popoverNewPlaylist, setPopoverNewPlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const openClosePopoverNewPlaylist = () => {
    if (popoverNewPlaylist) {
      setPlaylistName('');
    }

    setPopoverNewPlaylist(!popoverNewPlaylist);
  };

  const createPlaylist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (playlistName) {
      const newPlaylist: Playlist = {
        ...createGenericPlaylist(),
        title: playlistName,
      };

      await PlaylistPersistenceService.create(newPlaylist);
      log.info('[SideBar] Creating playlist:', newPlaylist.title);
    }

    openClosePopoverNewPlaylist();
  };

  return (
    <div className='z-10 flex h-12 w-full items-center justify-between gap-1 px-2 py-1 transition-all'>
      <Popover open={popoverNewPlaylist}>
        <PopoverTrigger asChild>
          <Button
            variant='surface'
            onClick={openClosePopoverNewPlaylist}
            className={`text-text-secondary hover:text-text-primary flex aspect-square rounded-full p-0 transition-all ${collapsed ? 'mx-1' : ''}`}
          >
            <Plus size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent align='center'>
          <form
            onSubmit={(e) => createPlaylist(e)}
            className='flex flex-col gap-2'
          >
            <Input
              className='h-10 rounded-full'
              placeholder='Nova playlist'
              name='new-playlist'
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <Button
              variant={'filled'}
              type='submit'
              className='bg-accent transition-all hover:saturate-125'
            >
              Criar Playlist
            </Button>
          </form>
        </PopoverContent>
      </Popover>

      <div
        className={`flex h-full items-center ${collapsed ? 'w-0 overflow-clip' : 'w-full'}`}
      >
        <SearchBox
          name='playlist-search'
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
