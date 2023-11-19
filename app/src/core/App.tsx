import React from 'react'

import Box from '@mui/material/Box'

import AppBar from '../componentes/appbar/AppBar';
import Sidebar from '../componentes/sidebar/Sidebar';
import Rotas from './Rotas';
import PlayerControl from '../componentes/PlayerControl/PlayerControl';

export default function App() {
  return (
    <Box sx={{ /* Flex column */
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'nowrap',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
    }}>
      <AppBar />
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        p: '8px'
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
      <PlayerControl />
    </Box>
  )
}