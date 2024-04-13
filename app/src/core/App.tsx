import { CSSProperties, useState } from 'react';
import { HashRouter } from 'react-router-dom';

import AppBar from '../componentes/AppBar/AppBar';
import SideBar from '../componentes/SideBar/SideBar';
import Rotas from './Rotas';
import PlaybackConsole from '../componentes/PlaybackConsole/PlaybackConsole';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const appBarHeight = 36;
  const playConsoleHeight = 96;

  const contentCols = collapsed
    ? 'grid-cols-[64px,repeat(3,minmax(0,1fr))]'
    : 'grid-cols-[256px,repeat(3,minmax(0,1fr))]';

  const contentHeight =
    'max-h-[calc(100vh-var(--appbar-height)-var(--playconsole-height))]';

  return (
    <HashRouter>
      <div
        className={`grid h-screen w-full grid-rows-[var(--appbar-height),1fr,var(--playconsole-height)] overflow-hidden bg-black`}
        style={
          {
            '--appbar-height': `${appBarHeight}px`,
            '--playconsole-height': `${playConsoleHeight}px`,
          } as CSSProperties
        }
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
              'row-[1/3] flex w-full flex-col items-center overflow-clip bg-zinc-900 transition-all'
            }
          />
          <Rotas className='relative col-[2/5] row-[1/3] overflow-clip bg-zinc-800' />
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
