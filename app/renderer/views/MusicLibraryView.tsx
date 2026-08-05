import { useState, useMemo } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

import MediaCard from '@renderer/components/MediaCard';
import useLibraryStore from '@renderer/stores/useLibraryStore';
import SearchBox from '@renderer/components/SearchBox';
import EmptyLibrary from '@renderer/components/EmptyLibrary';
import { sortUtils } from '@shared/utils/sortUtils';

export default function MusicLibraryView() {
  const [search, setSearch] = useState('');
  const audio = useLibraryStore((state) => state.contents.audio);
  const loading = useLibraryStore((state) => state.loading);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredTracks = useMemo(() => {
    return sortUtils.sortByDate(
      audio.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase()),
      ),
      'modifiedAt',
      'desc',
    );
  }, [audio, search]);

  if (loading.playlists || loading.audio) {
    return (
      <div className='flex items-center justify-center'>Carregando...</div>
    );
  }

  return (
    <div className='flex h-full min-h-0 flex-col items-center gap-4 p-4'>
      <SearchBox
        name='music-search'
        canChangeVisibility={false}
        placeholder='Buscar música...'
        onSearch={handleSearch}
        className='max-w-75'
      />
      <div className='flex min-h-0 w-full flex-1'>
        {filteredTracks.length > 0 && (
          <VirtuosoGrid
            className='w-full'
            listClassName='grid justify-center gap-y-10 grid-cols-2 xs:grid-cols-3 xs:gap-8 sm:grid-cols-4 sm:gap-y-10 xl:grid-cols-5 2xl:grid-cols-6'
            data={filteredTracks}
            overscan={20}
            itemContent={(_, item) => (
              <div key={item.id} className='flex justify-center'>
                <MediaCard item={item} queue={filteredTracks} />
              </div>
            )}
          />
        )}
      </div>
      {audio.length === 0 && <EmptyLibrary viewName='MusicLibrary' />}
    </div>
  );
}
