import { useState, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

import MediaCard from '@/componentes/MediaCard/MediaCard';
import { Input } from '@/componentes/ui/input';
import { useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@/Root';
import { Button } from '@/componentes/ui/button';

export default function MusicLibrary() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;
  const revalidator = useRevalidator();

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
    const pathsToScan = await window.VimpAPI.config.get('musicFolders');
    const trackPaths = await window.VimpAPI.library.scanTracks(pathsToScan);

    const tracksDB = await window.VimpAPI.library.importTracks(trackPaths);
    console.log(tracksDB);

    revalidator.revalidate();
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

      <div className='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4 2xl:grid-cols-5'>
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <MediaCard key={index} item={track} queue={filteredTracks} />
          ))
        ) : (
          <div className='col-span-4 flex h-80 flex-col items-center justify-center space-y-4 text-neutral-400'>
            <h1>Sua biblioteca está vazia</h1>
            <Button variant={'outline'} onClick={forceScan}>
              Escanear arquivos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
