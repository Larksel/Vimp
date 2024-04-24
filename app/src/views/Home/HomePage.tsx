import CardList from '@/componentes/CardList/CardList';
import { Track } from '../../../shared/types/vimp';

const exemplo: Track[] = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
]
export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <CardList data={exemplo}/>
      <CardList data={exemplo}/>
      <CardList data={exemplo}/>
    </div>
  );
}
