import { HashRouter } from 'react-router-dom';
import Box from '@mui/material/Box';

import AppBar from '../componentes/appbar/AppBar';
import Sidebar from '../componentes/sidebar/Sidebar';
import Header from '../componentes/header/Header';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/playbackconsole/PlaybackConsole';

import Scrollbar from '../componentes/scrollbar/Scrollbar';

import * as ScrollArea from '@radix-ui/react-scroll-area';

import sizeConfigs from '../configs/sizeConfigs';
import { scrollbarStyle } from './scrollbarStyle';

export default function App() {
  return (
    <HashRouter>
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
          <Scrollbar>
            <div
              style={{
                maxWidth: 'calc(100vw - 316px)',
              }}
            >
              <Header />
              <Rotas />
            </div>
          </Scrollbar>
        </Box>
        <PlaybackConsole />
      </Box>
    </HashRouter>
  );
}
