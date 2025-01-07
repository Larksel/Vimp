import placeholderImage from '@assets/images/placeholder.png';

import { Button } from '@components/common/button';
import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import ListHeader from './ListHeader';
import InfoText from '@components/InfoText';
import { useEffect, useState } from 'react';
import { PlaylistModel } from '@shared/types/vimp';
import debounce from 'lodash/debounce';
import IPCChannels from '@shared/constants/IPCChannels';
import { useLocation, useNavigate } from 'react-router-dom';
import routes from '@renderer/routes';

interface PlaylistListProps {
  collapsed: boolean;
}

export default function PlaylistList({ collapsed }: PlaylistListProps) {
  const [playlists, setPlaylists] = useState<PlaylistModel[]>();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    async function fetchPlaylists() {
      const playlists = await window.VimpAPI.playlistsDB.getAll();
      setPlaylists(playlists);
    }

    fetchPlaylists();

    window.VimpAPI.app.onDBChanged(
      debounce(() => {
        fetchPlaylists();
      }, 500),
    );

    return function cleanup() {
      window.VimpAPI.app.removeAllListeners(IPCChannels.DB_HAS_CHANGED);
    };
  }, []);

  const playlistView = (playlistID: string) => {
    const viewRoute = routes.PLAYLIST.replace(':id', playlistID);

    if (pathname.replace('/', '') !== viewRoute) {
      navigate(viewRoute);
    }
  };

  return (
    <ScrollArea className='relative h-full w-full rounded-lg bg-[#121212]'>
      <ListHeader collapsed={collapsed} />
      <div className='pt-11'>
        {playlists?.map((pl, index) => (
          <Button
            key={pl._id}
            variant='default'
            onClick={() => playlistView(pl._id)}
            className='flex h-16 w-full justify-start gap-4 rounded-none bg-transparent p-2 active:bg-[#fff3]'
          >
            <img
              src={pl.cover ?? placeholderImage}
              alt=''
              className='h-12 w-12 shrink-0 rounded bg-neutral-800 object-cover'
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
      </div>
      <ScrollBar orientation='vertical' />
    </ScrollArea>
  );
}
