import { CSSProperties, useState } from 'react';
import { Outlet } from 'react-router-dom';

import AppBar from './componentes/AppBar/AppBar';
import SideBar from './componentes/SideBar/SideBar';
import ScrollBar from './componentes/ScrollBar/ScrollBar';
import Header from './componentes/Header/Header';
import PlaybackConsole from './componentes/PlaybackConsole/PlaybackConsole';

export default function Root() {
  const [collapsed, setCollapsed] = useState(false);

  const appBarHeight = 36;
  const playConsoleHeight = 80;
  const sidebarSmall = 64;
  const sidebarLarge = 256;

  const cssVars = {
    '--appbar-height': `${appBarHeight}px`,
    '--playconsole-height': `${playConsoleHeight}px`,
    '--sidebar-width': `${collapsed ? sidebarSmall : sidebarLarge}px`,
  } as CSSProperties;

  return (
    <div
      style={cssVars}
      className='grid h-screen w-full grid-cols-4 grid-rows-[var(--appbar-height),1fr,var(--playconsole-height)] overflow-hidden bg-black transition-all'
    >
      <AppBar />

      <div className='col-span-4 row-span-1 grid max-h-[calc(100vh-var(--appbar-height)-var(--playconsole-height))] grid-cols-[var(--sidebar-width),repeat(3,1fr)] grid-rows-2 gap-2 overflow-clip p-2 transition-all'>
        <SideBar
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />

        <div className='relative col-span-3 row-span-2 overflow-clip rounded-lg bg-neutral-900'>
          <Header />
          <ScrollBar>
            <div className='h-full w-[calc(100vw-24px-var(--sidebar-width))] bg-gradient-to-b from-white/5 to-[16rem] p-4 pt-16 transition-all'>
              <Outlet />
            </div>
          </ScrollBar>
        </div>
      </div>

      <PlaybackConsole />
    </div>
  );
}
