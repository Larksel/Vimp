import { useEffect, useState } from 'react';
import { TrackModel } from '../../../shared/types/vimp';

import { Button } from '@/componentes/ui/button';
import MediaCard from '@/componentes/MediaCard/MediaCard';

import queue from '@/lib/queue';
import player from '@/lib/player';

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<TrackModel[]>();

  useEffect(() => {
    async function getTracks() {
      const res: TrackModel[] = await window.VimpAPI.db.getTracks();

      setTracks(res);
    }

    getTracks();
  }, []);

  const playTracks = () => {
    console.log('add to playlist');

    tracks?.map((track) => queue.add(track));
    player.startFromQueue();
  };

  return (
    <div className='flex flex-col items-center'>
      <Button
        onClick={playTracks}
        variant='default'
        className='my-4 bg-purple-500 hover:bg-purple-500/80'
      >
        Play all
      </Button>
      <div className='grid w-full grid-cols-3 justify-items-center gap-6 xl:grid-cols-4 2xl:grid-cols-5'>
        {tracks &&
          tracks.map((track, index) => <MediaCard key={index} item={track} />)}
      </div>
    </div>
  );
}
