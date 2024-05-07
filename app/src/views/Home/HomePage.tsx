import CardList from '@/componentes/CardList/CardList';
import { Track } from '../../../shared/types/vimp';

const exemplo: Track[] = Array.from({ length: 7 }, () => ({
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
}));

export default function HomePage() {
  return (
    <div>
      <h1>Músicas recentes</h1>
      <CardList data={exemplo} />

      <h1 className='mt-10'>Favoritas</h1>
      <CardList data={exemplo} />

      <h1 className='mt-10'>Playlists</h1>
      <CardList data={exemplo} />

      <h1 className='mt-10'>Mais tocadas</h1>
      <CardList data={exemplo} />
    </div>
  );
}
