import AppBar from '../components/AppBar';
import SideBar from '../components/SideBar';
import { ScrollArea, ScrollBar } from '@renderer/components/common';
import Header from '../components/Header';
import { PlaybackConsole } from '@renderer/features/player';
import { Outlet } from 'react-router-dom';
import useLayoutSizes from '@renderer/hooks/useLayoutSizes';
import { useState } from 'react';

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { cssVars } = useLayoutSizes({
    autoHideConsole: true,
    absoluteAppBar: false,
    collapsed: collapsed,
  });

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
