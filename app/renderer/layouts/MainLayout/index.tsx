import { CSSProperties, useState } from 'react';

import AppBar from './components/AppBar';
import SideBar from './components/SideBar';
import { ScrollArea, ScrollBar } from '@renderer/components/common';
import Header from './components/Header';
import { useCurrentTrack, PlaybackConsole } from '@renderer/features/player';
import { useDataLoader } from '@renderer/features/data';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const track = useCurrentTrack();

  useDataLoader();

  const appBarHeight = 36;
  const playConsoleHeight = track ? 80 : 0;
  const sidebarSmall = 64;
  const sidebarLarge = 256;

  const cssVars = {
    '--appbar-height': `${appBarHeight}px`,
    '--playconsole-height': `${playConsoleHeight}px`,
    '--sidebar-width': `${collapsed ? sidebarSmall : sidebarLarge}px`,
    '--content-height': `calc(100vh - ${appBarHeight}px - ${playConsoleHeight}px)`,
    '--content-width': `calc(100vw - 24px - var(--sidebar-width))`,
  } as CSSProperties;

  return (
    <div
      style={cssVars}
      className='bg-background flex h-screen w-screen flex-col overflow-hidden transition-all'
    >
      <AppBar />

      <div className='flex h-(--content-height) shrink-0 gap-2 overflow-clip p-2 transition-all'>
        <SideBar
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />

        <div className='bg-surface-base relative overflow-clip rounded-lg'>
          <Header />
          <ScrollArea className='relative h-full w-full'>
            <div className='h-full w-(--content-width) pt-16 transition-all *:h-full'>
              <Outlet />
            </div>
            <ScrollBar orientation='vertical' />
          </ScrollArea>
        </div>
      </div>

      <PlaybackConsole />
    </div>
  );
}
