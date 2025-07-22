import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@renderer/components/common/scroll-area';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import routes from '@renderer/routes/routes';
import ListHeader from './ListHeader';
import PlaylistItem from './PlaylistItem';
import PlaylistMenu from '@renderer/components/ContextMenu/PlaylistMenu';

interface PlaylistListProps {
  collapsed: boolean;
}

export default function PlaylistList(props: PlaylistListProps) {
  const { collapsed } = props;
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
    <div className='bg-surface-base flex h-full w-full flex-col overflow-hidden rounded-lg'>
      <ListHeader collapsed={collapsed} searchHandler={handleSearch} />
      <ScrollArea>
        {filteredPlaylists.map((playlist, index) => (
          <PlaylistMenu key={playlist._id} playlist={playlist}>
            <PlaylistItem
              collapsed={collapsed}
              playlist={playlist}
              index={index}
              onClick={playlistView}
            />
          </PlaylistMenu>
        ))}
        <ScrollBar orientation='vertical' />
      </ScrollArea>
    </div>
  );
}
