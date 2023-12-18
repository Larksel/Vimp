import React from 'react';

import Box from '@mui/material/Box';

import loadable from '@loadable/component';

const AppBar = loadable(() =>
  import('../componentes/appbar/AppBar')
);

const Sidebar = loadable(() =>
  import('../componentes/sidebar/Sidebar')
);

const Rotas = loadable(() =>
  import('./Rotas')
);

const PlayerControlBar = loadable(() =>
  import('../componentes/playercontrolbar/PlayerControlBar')
);

import sizeConfigs from '../configs/sizeConfigs';

export default function App() {
  return (
    <Box sx={{ /* Flex column */
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
      <PlayerControlBar />
    </Box>
  )
}