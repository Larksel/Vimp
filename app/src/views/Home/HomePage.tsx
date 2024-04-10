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
]

export default function HomePage() {
  return (
    <>
      <div className='flex flex-col bg-red-500 w-fit'>
        <div className='w-fit'>
          <h1>Músicas recentes</h1>
          {/* <CardList data={skeleton} /> */}

          <br />

          <h1>Favoritas</h1>
          {/* <CardList data={skeleton} /> */}
          <br />

          <h1>Playlists</h1>
          {/* <CardList data={skeleton} /> */}
          <br />

          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          <h1>Mais tocadas</h1>
          {/* <CardList data={skeleton} /> */}
        </div>
      </div>
    </>
  );
}
