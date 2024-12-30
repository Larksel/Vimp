import { useState, useCallback, useMemo } from 'react';
import log from 'electron-log/renderer';
import { debounce } from 'lodash';
import { VirtuosoGrid } from 'react-virtuoso';

import MediaCard from '@components/MediaCard';
import { Input } from '@components/common/input';
import { useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@views/RootView';
import { Button } from '@components/common/button';

export default function MusicLibraryView() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;

  const debouncedSetSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 300),
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    debouncedSetSearch(value);
  };

  const filteredTracks = useMemo(() => {
    return tracks.filter((track) =>
      track.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [tracks, debouncedSearch]);

  const forceScan = async () => {
    log.debug('[MusicLibraryView] Triggered library scan and save');
    const importedFiles = await window.VimpAPI.library.scanAndSave();
    console.log(importedFiles);
  };

  return (
    <div className='flex flex-col items-center'>
      <Input
        type='search'
        name='search'
        id='search'
        placeholder='Buscar música'
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
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
