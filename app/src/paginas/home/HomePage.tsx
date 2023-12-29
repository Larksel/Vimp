import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import GenericCard from '../../componentes/genericcard/GenericCard';

//TODO Implementar a lógica do scroll horizontal
//TODO Criar componente para generalizar as listas horizontais
//TODO Criar componente para o cabeçalho das páginas

export default function HomePage() {
  return (
    <>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        p: '16px'
      }}>
        <Box>Header</Box>
        <Box>
          <Typography>Músicas recentes</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '24px',
          }}>
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
          </Box>
          <br />
          <Typography>Favoritas</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '24px'
          }}>
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
          </Box>
          <br />
          <Typography>Playlists</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '24px'
          }}>
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
          </Box>
          <br />
          <Typography>Mais tocadas</Typography>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '24px'
          }}>
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
            <GenericCard 
              title='Titulo'
              subtitle='Artista'
              action={() => console.log('card clicado')}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
}