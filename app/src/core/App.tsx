import { HashRouter } from 'react-router-dom';

import AppBar from '../componentes/AppBar/AppBar';
import SideBar from '../componentes/SideBar/SideBar';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

import { useState } from 'react';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const appBarHeight = 36;
  const pbConsoleHeight = 96; // TODO Broken: changing this breaks the layout

  const windowRows = `grid-rows-[${appBarHeight}px,1fr,${pbConsoleHeight}px]`;

  const contentCols = collapsed
    ? 'grid-cols-[64px,repeat(3,minmax(0,1fr))]'
    : 'grid-cols-[256px,repeat(3,minmax(0,1fr))]';
  const contentHeight = `max-h-[calc(100vh-${appBarHeight}px-${pbConsoleHeight}px)]`;

  return (
    <HashRouter>
      <div
        className={`grid h-screen w-full ${windowRows} overflow-hidden bg-black`}
      >
        <AppBar
          className={'col-[1/5] row-[1/2] h-full w-full select-none bg-black'}
        />
        <div
          className={`grid grid-rows-2 ${contentCols} col-[1/5] row-[2/3] ${contentHeight} overflow-clip transition-all`}
        >
          <SideBar
            toggle={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
            className={
              'row-[1/3] flex w-full flex-col items-center overflow-clip bg-neutral-900 transition-all'
            }
          />
          <Rotas className='relative col-[2/5] row-[1/3] overflow-clip' />
        </div>

        <PlaybackConsole
          className={
            'z-10 col-[1/5] row-[3/4] flex h-full w-full items-center justify-between bg-black px-2'
          }
        />
      </div>
    </HashRouter>
  );
}
