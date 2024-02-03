import { HashRouter } from 'react-router-dom';
import CustomScroll from 'react-custom-scroll';
import Box from '@mui/material/Box';

import AppBar from '../componentes/AppBar/AppBar';
import Sidebar from '../componentes/Sidebar/Sidebar';
import Header from '../componentes/Header/Header';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

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
          <Box
            sx={[{
              bgcolor: '#121212',
              borderRadius: '8px',
              width: '100%',
              position: 'relative',
              overflow: 'hidden',
            }, scrollbarStyle]}
          >
            <CustomScroll heightRelativeToParent='100%'>
              <Header />
              <Rotas />
            </CustomScroll>
          </Box>
        </Box>
        <PlaybackConsole />
      </Box>
    </HashRouter>
  );
}
