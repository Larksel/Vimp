import { useMemo, useState } from 'react';
import placeholderImage from '@assets/images/placeholder.png';

import { Button } from '@components/common/button';
import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import ListHeader from './ListHeader';
import InfoText from '@components/InfoText';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@renderer/routes';
import useLibraryStore from '@stores/useLibraryStore';

interface PlaylistListProps {
  collapsed: boolean;
}

export default function PlaylistList({ collapsed }: PlaylistListProps) {
  const playlists = useLibraryStore((state) => state.contents.playlists);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const filteredPlaylists = useMemo(() => {
    return playlists.filter((playlist) =>
      playlist.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [playlists, search]);

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
  };

  const playlistView = (playlistID: string) => {
    const viewRoute = routes.PLAYLIST.replace(':id', playlistID);

    if (pathname.replace('/', '') !== viewRoute) {
      navigate(viewRoute);
    }
  };

  return (
    <>
      <ListHeader collapsed={collapsed} searchHandler={handleSearch} />
      <div className='h-[calc(100%-48px)]'>
        <ScrollArea className='h-full'>
          {filteredPlaylists.map((pl, index) => (
            <Button
              key={pl._id}
              variant='default'
              onClick={() => playlistView(pl._id)}
              className='flex h-16 w-full justify-start gap-4 rounded-none bg-transparent p-2 active:bg-[#fff3]'
            >
              <img
                src={pl.cover ?? placeholderImage}
                alt=''
                className='h-12 w-12 shrink-0 rounded-sm bg-neutral-800 object-cover'
              />

              <div
                className={`flex w-full flex-col overflow-clip whitespace-nowrap transition-all ${collapsed ? '-translate-x-3 opacity-0' : ''}`}
                style={{
                  transitionDelay: !collapsed ? `${(index + 1) * 75}ms` : '',
                }}
              >
                <InfoText variant='primary'>{pl.title}</InfoText>
                <InfoText variant='secondary'>Playlist</InfoText>
              </div>
            </Button>
          ))}
          <ScrollBar orientation='vertical' />
        </ScrollArea>
      </div>
    </>
  );
}
