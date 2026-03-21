import { useState } from 'react';
import BaseLayout from './BaseLayout';
import useLayoutSizes from '@renderer/hooks/useLayoutSizes';
import SideBar from './components/SideBar';
import Header from './components/Header';
import { ScrollArea, ScrollBar } from '@renderer/components/common';
import { Outlet } from 'react-router-dom';

export default function FrameLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { cssVars } = useLayoutSizes({
    collapsed: isSidebarCollapsed,
  });

  return (
    <BaseLayout isAppBarAbsolute={false} autoHideConsole={true}>
      <div style={cssVars} className='flex h-full min-h-0 flex-row gap-2 p-2'>
        <SideBar
          collapsed={isSidebarCollapsed}
          toggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className='bg-surface-base relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-lg'>
          <Header />
          <ScrollArea className='relative h-full w-full pt-16'>
            <Outlet />
            <ScrollBar orientation='vertical' />
          </ScrollArea>
        </main>
      </div>
    </BaseLayout>
  );
}
