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

  const contentCols = collapsed
    ? 'grid-cols-[64px,repeat(3,minmax(0,1fr))]'
    : 'grid-cols-[256px,repeat(3,minmax(0,1fr))]';

  return (
    <HashRouter>
      <div className='grid h-screen w-full grid-cols-1 grid-rows-[36px,1fr,96px] overflow-hidden bg-black'>
        <AppBar />
        <div
          className={`grid grid-rows-2 ${contentCols} row-[2/2] max-h-[calc(100vh-36px-96px)] overflow-clip transition-all`}
        >
          <SideBar
            className={
              'row-[1/3] flex w-full flex-col items-center overflow-clip bg-neutral-900 transition-all'
            }
            collapsed={collapsed}
            toggle={() => setCollapsed(!collapsed)}
          />
          <div className='relative col-[2/5] row-[1/3] overflow-clip'>
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
