import { PlusIcon } from '@phosphor-icons/react/dist/csr/Plus';
import { ListBulletsIcon } from '@phosphor-icons/react/dist/csr/ListBullets';
import {
  Button,
  Input,
  Popover,
  RadioGroup,
  RadioGroupItem,
} from '@renderer/components/common';
import SearchBox from '@renderer/components/SearchBox';
import { FormEvent, useState } from 'react';
import { createRendererLogger } from '@renderer/utils/logger';
import { Playlist } from '@shared/types/vimp';
import { createGenericPlaylist } from '@shared/utils/utils';
import { PlaylistService } from '@renderer/services/playlistService';

const logger = createRendererLogger('SideBar');

interface ListHeaderProps {
  collapsed: boolean;
  searchHandler: (search: string) => void;
}

export default function ListHeader(props: ListHeaderProps) {
  const { collapsed, searchHandler } = props;
  const [popoverNewPlaylist, setPopoverNewPlaylist] = useState(false);
  const [popoverOptions, setPopoverOptions] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  const openClosePopoverNewPlaylist = () => {
    if (popoverNewPlaylist) {
      setPlaylistName('');
    }

    setPopoverNewPlaylist(!popoverNewPlaylist);
  };

  const openClosePopoverOptions = () => {
    setPopoverOptions(!popoverOptions);
  };

  const createPlaylist = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (playlistName) {
      const newPlaylist: Playlist = {
        ...createGenericPlaylist(),
        title: playlistName,
      };

      await PlaylistService.create(newPlaylist);
      logger.info(`Creating playlist: ${newPlaylist.title}`);
    }

    openClosePopoverNewPlaylist();
  };

  return (
    <div className='z-10 flex h-12 w-full items-center justify-between gap-1 px-2 py-1 transition-all'>
      <Popover.Popover open={popoverNewPlaylist} modal>
        <Popover.PopoverTrigger asChild>
          <Button
            variant='surface'
            onClick={openClosePopoverNewPlaylist}
            className={`text-text-secondary hover:text-text-primary flex aspect-square rounded-full p-0 transition-all ${collapsed && 'mx-1'}`}
          >
            <PlusIcon size={20} />
          </Button>
        </Popover.PopoverTrigger>
        <Popover.PopoverContent
          align='center'
          onEscapeKeyDown={openClosePopoverNewPlaylist}
          onInteractOutside={openClosePopoverNewPlaylist}
        >
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
        </Popover.PopoverContent>
      </Popover.Popover>

      <div
        className={`flex h-full items-center ${collapsed ? 'w-0 overflow-clip' : 'w-full'}`}
      >
        <SearchBox
          name='playlist-search'
          canChangeVisibility={true}
          onSearch={searchHandler}
        />
      </div>

      <Popover.Popover open={popoverOptions} modal>
        <Popover.PopoverTrigger asChild>
          <Button
            variant='surface'
            onClick={openClosePopoverOptions}
            className={`text-text-secondary hover:text-text-primary flex aspect-square rounded-full p-0 transition-all ${collapsed && 'w-0 overflow-clip'}`}
          >
            <ListBulletsIcon size={20} />
          </Button>
        </Popover.PopoverTrigger>
        <Popover.PopoverContent
          align='center'
          side='left'
          onEscapeKeyDown={openClosePopoverOptions}
          onInteractOutside={openClosePopoverOptions}
        >
          <div className='flex flex-col'>
            <h6 className='font-semibold'>Sort By</h6>
            <RadioGroup defaultValue='title'>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='title' id='title' />
                <label htmlFor='title'>Title</label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='artist' id='artist' />
                <label htmlFor='artist'>Artist</label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='album' id='album' />
                <label htmlFor='album'>Album</label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='dateAdded' id='dateAdded' />
                <label htmlFor='dateAdded'>Date Added</label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='duration' id='duration' />
                <label htmlFor='duration'>Duration</label>
              </div>
            </RadioGroup>
            <h6 className='font-semibold'>Direction</h6>
            <RadioGroup defaultValue='ascending'>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='ascending' id='ascending' />
                <label htmlFor='ascending'>Ascending</label>
              </div>
              <div className='flex items-center gap-3'>
                <RadioGroupItem value='descending' id='descending' />
                <label htmlFor='descending'>Descending</label>
              </div>
            </RadioGroup>
          </div>
        </Popover.PopoverContent>
      </Popover.Popover>
    </div>
  );
}
