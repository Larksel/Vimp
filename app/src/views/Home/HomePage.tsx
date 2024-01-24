import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CardList from '../../componentes/CardList/CardList';
import player from '../../lib/player';

//TODO Criar componente para o cabeçalho das páginas

const data = [
  {
    title: 'Hello',
    desc: 'World',
  },
  {
    title: 'Hello',
    desc: 'World',
  },
  {
    title: 'Hello',
    desc: 'World',
  },
  {
    title: 'Hello',
    desc: 'World',
  },
  {
    title: 'Hello',
    desc: 'World',
  },
];

const openFile = async () => {
  const url = await window.VimpAPI.openFile();

  player.setTrack(url);
  player.play();
};

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
          <button onClick={openFile}>Open File</button>
          <Typography>Músicas recentes</Typography>
          <CardList data={data} />

          <br />

          <Typography>Favoritas</Typography>
          <CardList data={data} />
          <br />

          <Typography>Playlists</Typography>
          <CardList data={data} />
          <br />

          <Typography>Mais tocadas</Typography>
          <CardList data={data} />
        </Box>
      </Box>
    </>
  );
}
