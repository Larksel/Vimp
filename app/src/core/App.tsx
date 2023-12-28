import React from 'react';

import Box from '@mui/material/Box';

import AppBar from '../componentes/appbar/AppBar';
import Sidebar from '../componentes/sidebar/Sidebar';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/playbackconsole/PlaybackConsole'

import sizeConfigs from '../configs/sizeConfigs';

export default function App() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      bgcolor: '#000'
    }}>
      <AppBar />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        p: '8px 8px 0',
        height: `${sizeConfigs.mainContent.height}`
      }}>
        <Sidebar />
        <Box sx={{
          bgcolor: '#121212',
          borderRadius: '8px',
          width: '100%',
          overflow: 'hidden'
        }}>
          <Rotas />
        </Box>
      </Box>
      <PlaybackConsole />
    </Box>
  )
}