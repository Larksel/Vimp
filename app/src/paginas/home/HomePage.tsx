import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import CardList from '../../componentes/CardList/CardList';

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

const pickFiles = async () => {
  const result = await window.VimpAPI.pickFile();

  console.log(result);
};

export default function HomePage() {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: '16px',
        }}
      >
        <Box>Header</Box>
        <Box>
          <button onClick={pickFiles}>Pick Files</button>
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
