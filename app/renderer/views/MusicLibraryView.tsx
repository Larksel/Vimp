import { useState, useMemo } from 'react';
import log from 'electron-log/renderer';
import { VirtuosoGrid } from 'react-virtuoso';

import MediaCard from '@components/MediaCard';
import { Button } from '@components/common/button';
import useLibraryStore from '@stores/useLibraryStore';
import SearchBox from '@components/SearchBox';

export default function MusicLibraryView() {
  const [search, setSearch] = useState('');
  const tracks = useLibraryStore((state) => state.contents.tracks);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tracks, search]);

  const forceScan = async () => {
    log.debug('[MusicLibraryView] Triggered library scan and save');
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);
  };

  return (
    <div className='flex flex-col items-center'>
      <SearchBox
        name='search-music'
        canChangeVisibility={false}
        placeholder='Buscar música...'
        onSearch={handleSearch}
        className='mb-4 max-w-[300px]'
      />
      {filteredTracks.length > 0 && (
        <div className='flex h-full w-full items-center justify-center'>
          <VirtuosoGrid
            className='w-full overflow-clip'
            listClassName='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4 2xl:grid-cols-5'
            data={filteredTracks}
            overscan={10}
            itemContent={(index, track) => (
              <MediaCard key={index} item={track} queue={filteredTracks} />
            )}
          />
        </div>
      )}
      {tracks.length === 0 && (
        <div className='flex h-full w-full items-center justify-center'>
          <div className='flex h-80 flex-col items-center justify-center space-y-4 text-neutral-400'>
            <h1>Sua biblioteca está vazia</h1>
            <Button variant={'outline'} onClick={forceScan}>
              Escanear arquivos
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
