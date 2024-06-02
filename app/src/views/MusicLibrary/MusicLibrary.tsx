import { useEffect, useState } from 'react';
import { TrackModel } from '../../../shared/types/vimp';

import MediaCard from '@/componentes/MediaCard/MediaCard';
import { Input } from '@/componentes/ui/input';

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<TrackModel[]>();
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function getTracks() {
      const res: TrackModel[] = await window.VimpAPI.db.getTracks();

      const orderedTracks = res.sort((a, b) => {
        if (!a) return 1;
        if (!b) return -1;

        const titleA = a.title
          .normalize('NFKD')
          .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');
        const titleB = b.title
          .normalize('NFKD')
          .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');

        return titleA.localeCompare(titleB);
      });

      setTracks(orderedTracks);
    }

    getTracks();
  }, []);

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
        {filteredTracks &&
          filteredTracks.map((track, index) => (
            <MediaCard key={index} item={track} queue={filteredTracks} />
          ))}
      </div>
    </div>
  );
}
