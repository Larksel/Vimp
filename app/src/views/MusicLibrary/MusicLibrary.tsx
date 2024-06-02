import { useState } from 'react';

import MediaCard from '@/componentes/MediaCard/MediaCard';
import { Input } from '@/componentes/ui/input';
import { useRouteLoaderData } from 'react-router-dom';
import { RootLoaderData } from '@/Root';

//TODO lista virtual

export default function MusicLibrary() {
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;
  const [search, setSearch] = useState('');

  const filteredTracks =
    tracks &&
    (search.length > 0
      ? tracks.filter((track) =>
          track.title.toLowerCase().includes(search.toLowerCase()),
        )
      : tracks);

  return (
    <div className='flex flex-col items-center'>
      <Input
        type='search'
        name='search'
        id='search'
        placeholder='Buscar música'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className='mb-4 max-w-[300px]'
      />

      <div className='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4 2xl:grid-cols-5'>
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <MediaCard key={index} item={track} queue={filteredTracks} />
          ))
        ) : (
          <div className='flex h-80 items-center justify-center text-neutral-400 col-span-4'>
            Sua biblioteca está vazia
          </div>
        )}
      </div>
    </div>
  );
}
