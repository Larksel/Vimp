import { useEffect, useState } from 'react';
import { Track } from '../../../shared/types/vimp';

import { Button } from '@/componentes/ui/button';

import TrackList from '../../componentes/TrackList/TrackList';
import queue from '../../lib/queue';

//TODO estado da lista de música reseta ao mudar de página
//TODO lista virtual

export default function MusicLibrary() {
  const [tracks, setTracks] = useState<Track[]>();

  useEffect(() => {
    async function getTracks() {
      const res: Track[] = await window.VimpAPI.db.getTracks();

      setTracks(res);
    }

    getTracks();
  }, []);

  const playTracks = () => {
    console.log('add to playlist');

    tracks?.map((track) => {
      if (
        !queue
          .getQueue()
          .some((existingTrack) => existingTrack.path === track.path)
      ) {
        queue.add(track);
      }
    });

    queue.play();
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
      {tracks ? <TrackList data={tracks} /> : ''}
    </div>
  );
}
