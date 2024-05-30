import CardList from '@/componentes/CardList/CardList';
import { TrackModel } from '../../../shared/types/vimp';
import { useEffect, useState } from 'react';

const exemplo: TrackModel[] = Array.from({ length: 5 }, () => ({
  title: 'titulo',
  album: 'album',
  artist: ['artista'],
  genre: ['genero'],
  duration: 375,
  playCount: 0,
  favorite: false,
  lastPlayed: null,
  path: '',
  cover: '',
  _id: '',
  _rev: '',
}));

export default function HomePage() {
  const [mostPlayed, setMostPlayed] = useState<TrackModel[]>(exemplo);
  const [favorites, setFavorites] = useState<TrackModel[]>(exemplo);
  const [recents, setRecents] = useState<TrackModel[]>(exemplo);

  useEffect(() => {
    async function getTracks() {
      const res: TrackModel[] = await window.VimpAPI.db.getTracks();

      if (res.length > 0) {
        setRecents(res.slice(0, 5));
        setFavorites(res.slice(5, 10));
        setMostPlayed(res.slice(10, 15));
      }
    }

    getTracks();
  }, []);

  return (
    <div>
      <h1>Músicas recentes</h1>
      <CardList data={recents} />

      <h1 className='mt-10'>Favoritas</h1>
      <CardList data={favorites} />

      <h1 className='mt-10'>Mais tocadas</h1>
      <CardList data={mostPlayed} />
    </div>
  );
}
