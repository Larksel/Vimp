import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CardList from '../../componentes/CardList/CardList';

import { Track } from '../../../shared/types/vimp';

//TODO Criar componente para o cabeçalho das páginas
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
  },
]

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: '16px 4px 16px 16px',
        }}
      >
        <Box>Header</Box>
        <Box>
          <Typography>Músicas recentes</Typography>
          <CardList data={skeleton} />

          <br />

          <Typography>Favoritas</Typography>
          <CardList data={skeleton} />
          <br />

          <Typography>Playlists</Typography>
          <CardList data={skeleton} />
          <br />

          <Typography>Mais tocadas</Typography>
          <CardList data={skeleton} />
        </Box>
      </Box>
    </>
  );
}
