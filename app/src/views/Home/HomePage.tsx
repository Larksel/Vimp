import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CardList from '../../componentes/CardList/CardList';

import { Track } from '../../../shared/types/vimp';

const skeleton: Track[] = [
  {
    album: 'Album',
    artist: ['Artista'],
    duration: 0,
    favorite: false,
    genre: ['Gênero'],
    lastPlayed: null,
    path: '',
    playCount: 0,
    title: 'Título',
    cover: '',
  },
  {
    album: 'Album',
    artist: ['Artista'],
    duration: 0,
    favorite: false,
    genre: ['Gênero'],
    lastPlayed: null,
    path: '',
    playCount: 0,
    title: 'Título',
    cover: '',
  },
  {
    album: 'Album',
    artist: ['Artista'],
    duration: 0,
    favorite: false,
    genre: ['Gênero'],
    lastPlayed: null,
    path: '',
    playCount: 0,
    title: 'Título',
    cover: '',
  },
  {
    album: 'Album',
    artist: ['Artista'],
    duration: 0,
    favorite: false,
    genre: ['Gênero'],
    lastPlayed: null,
    path: '',
    playCount: 0,
    title: 'Título',
    cover: '',
  },
  {
    album: 'Album',
    artist: ['Artista'],
    duration: 0,
    favorite: false,
    genre: ['Gênero'],
    lastPlayed: null,
    path: '',
    playCount: 0,
    title: 'Título',
    cover: '',
  },
];

export default function HomePage() {
  return (
    <>
      <div className='flex h-full flex-col bg-neutral-800 pt-16'>
        Home
      </div>
    </>
  );
}
