import React from 'react';

import Box from '@mui/material/Box';

import AppBar from '../componentes/AppBar/AppBar';
import Sidebar from '../componentes/Sidebar/Sidebar';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

import sizeConfigs from '../configs/sizeConfigs';
import colorConfigs from '../configs/colorConfigs';

export default function App() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        bgcolor: '#000',
      }}
    >
      <AppBar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          p: '8px 8px 0',
          gap: '8px',
          height: `${sizeConfigs.mainContent.height}`,
        }}
      >
        <Sidebar />
        <Box
          sx={{
            bgcolor: '#121212',
            borderRadius: '8px',
            width: '100%',
            overflow: 'hidden',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: `${sizeConfigs.scrollbar}`,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: `${colorConfigs.scrollbar.thumb}`,
              borderRadius: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: `${colorConfigs.scrollbar.track}`,
              borderRadius: '8px',
            },
          }}
        >
          <Rotas />
        </Box>
      </Box>
      <PlaybackConsole />
    </Box>
  );
}
