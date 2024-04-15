import { CSSProperties, useState } from 'react';
import { HashRouter } from 'react-router-dom';

import AppBar from './componentes/AppBar/AppBar';
import SideBar from './componentes/SideBar/SideBar';
import Rotas from './Rotas';
import PlaybackConsole from './componentes/PlaybackConsole/PlaybackConsole';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const appBarHeight = 36;
  const playConsoleHeight = 88;
  const sidebarSmall = 64;
  const sidebarLarge = 256;

  const cssVars = {
    '--appbar-height': `${appBarHeight}px`,
    '--playconsole-height': `${playConsoleHeight}px`,
    '--sidebar-width': `${collapsed ? sidebarSmall : sidebarLarge}px`,
  } as CSSProperties;

  return (
    <HashRouter>
      <div
        className='grid h-screen w-full grid-cols-4 grid-rows-[var(--appbar-height),1fr,var(--playconsole-height)] overflow-hidden bg-black transition-all'
        style={cssVars}
      >
        <AppBar
          className={'col-span-4 row-span-1 h-full w-full select-none bg-black'}
        />

        <div className='col-span-4 row-span-1 px-2 grid max-h-[calc(100vh-var(--appbar-height)-var(--playconsole-height))] grid-cols-[var(--sidebar-width),repeat(3,1fr)] grid-rows-2 gap-2 overflow-clip transition-all'>
          <SideBar
            toggle={() => setCollapsed(!collapsed)}
            collapsed={collapsed}
            className={
              'row-span-2 flex w-full flex-col items-center overflow-clip rounded-lg bg-zinc-900 transition-all'
            }
          />
          <Rotas className='relative col-span-3 row-span-2 overflow-clip rounded-lg bg-zinc-800' />
        </div>

        <PlaybackConsole
          className={
            'z-10 col-span-4 row-span-1 flex h-full w-full items-center justify-between bg-black px-2'
          }
        />
      </div>
    </HashRouter>
  );
}
