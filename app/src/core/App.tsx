import { HashRouter } from 'react-router-dom';

import AppBar from '../componentes/AppBar/AppBar';
import SideBar from '../componentes/SideBar/SideBar';
import Header from '../componentes/Header/Header';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

import ScrollBar from '../componentes/ScrollBar/ScrollBar';
import { useState } from 'react';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <HashRouter>
      <div className='grid h-screen w-full grid-cols-1 grid-rows-[36px,auto,96px] overflow-hidden bg-black'>
        <AppBar />
        <div
          className={`grid grid-rows-1 ${collapsed ? 'grid-cols-[80px,auto]' : 'grid-cols-[320px,auto]'} overflow-clip bg-red-500 transition-all`}
          style={{
            maxHeight: 'calc(100vh - 36px - 96px)',
          }}
        >
          <SideBar
            collapsed={collapsed}
            toggle={() => setCollapsed(!collapsed)}
          />
          <div className='relative'>
            <Header />
            <ScrollBar>
              <Rotas />
            </ScrollBar>
          </div>
        </div>
        <PlaybackConsole />
      </div>
    </HashRouter>
  );
}
