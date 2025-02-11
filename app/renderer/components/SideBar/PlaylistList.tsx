import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import useLibraryStore from '@stores/useLibraryStore';
import routes from '@renderer/routes';
import ListHeader from './ListHeader';
import PlaylistItem from './PlaylistItem';

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
    <div className='bg-surface-base flex h-full w-full flex-col overflow-hidden rounded-lg'>
      <ListHeader collapsed={collapsed} searchHandler={handleSearch} />
      <ScrollArea>
        {filteredPlaylists.map((pl, index) => (
          <PlaylistItem
            key={pl._id}
            collapsed={collapsed}
            playlist={pl}
            index={index}
            onClick={playlistView}
          />
        ))}
        <ScrollBar orientation='vertical' />
      </ScrollArea>
    </div>
  );
}
