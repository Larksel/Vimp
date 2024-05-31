import { useEffect, useState } from 'react';
import { TrackModel } from '../../../shared/types/vimp';

import MediaCard from '@/componentes/MediaCard/MediaCard';

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<TrackModel[]>();

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

  return (
    <div className='flex flex-col items-center'>
      <div className='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4 2xl:grid-cols-5'>
        {tracks &&
          tracks.map((track, index) => (
            <MediaCard key={index} item={track} queue={tracks} />
          ))}
      </div>
    </div>
  );
}
