import { useState, useMemo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import MediaCard from '@renderer/components/MediaCard';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import SearchBox from '@renderer/components/SearchBox';
import EmptyLibrary from '@renderer/components/EmptyLibrary';
import { sortUtils } from '@shared/utils/sortUtils';

export default function MusicLibraryView() {
  const [search, setSearch] = useState('');
  const tracks = useLibraryStore((state) => state.contents.tracks);
  const loading = useLibraryStore((state) => state.loading);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tracks, search]);

  if (loading.playlists || loading.tracks) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  return (
    <div className='flex flex-col items-center px-4 pb-4'>
      <SearchBox
        name='music-search'
        canChangeVisibility={false}
        placeholder='Buscar música...'
        onSearch={handleSearch}
        className='mb-4 max-w-[300px]'
      />
      {filteredTracks.length > 0 && (
        <div className='flex h-full w-full items-center justify-center'>
          <VirtuosoGrid
            className='w-full overflow-clip'
            listClassName='grid w-full grid-cols-2 justify-items-center gap-6 xs:grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
            data={sortUtils.sortByDate(filteredTracks, 'dateModified', 'desc')}
            overscan={10}
            itemContent={(_, track) => (
              <MediaCard key={track._id} item={track} queue={filteredTracks} />
            )}
          />
        </div>
      )}
      {tracks.length === 0 && <EmptyLibrary viewName='MusicLibrary' />}
    </div>
  );
}
