import { CSSProperties, useEffect, useState } from 'react';
import log from 'electron-log/renderer';
import { Outlet, useRevalidator, useRouteLoaderData } from 'react-router-dom';
import { LoaderData } from '@renderer/router';
import debounce from 'lodash/debounce';

import { TrackModel } from '@shared/types/vimp';
import AppBar from '@components/AppBar';
import SideBar from '@components/SideBar';
import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import Header from '@components/Header';
import PlaybackConsole from '@components/PlaybackConsole';
import IPCChannels from '@shared/constants/IPCChannels';
import useCurrentTrack from '@hooks/useCurrentTrack';
import { usePlayerAPI } from '@stores/usePlayerStore';

export default function RootView() {
  const revalidator = useRevalidator();
  const [collapsed, setCollapsed] = useState(false);
  const track = useCurrentTrack();
  const { updateQueue } = usePlayerAPI();
  const { tracks } = useRouteLoaderData('root') as RootLoaderData;

  useEffect(() => {
    window.VimpAPI.app.onDBChanged(
      debounce(() => {
        log.debug('[RootView] DB changed');
        revalidator.revalidate();
      }, 500),
    );

    updateQueue(tracks);

    return function cleanup() {
      window.VimpAPI.app.removeAllListeners(IPCChannels.DB_HAS_CHANGED);
    };
  }, [revalidator]);

  const appBarHeight = 36;
  const playConsoleHeight = track ? 80 : 0;
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

        <div className='relative col-span-3 row-span-2 overflow-clip rounded-lg bg-[#121212]'>
          <Header />
          <ScrollArea className='relative h-full w-full'>
            <div className='h-full w-[calc(100vw-24px-var(--sidebar-width))] p-4 pt-16 transition-all *:h-full'>
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

export type RootLoaderData = LoaderData<typeof RootView.loader>;

RootView.loader = async () => {
  log.debug('[RootView] Loading tracks');
  const res: TrackModel[] = await window.VimpAPI.tracksDB.getAll();

  const tracks = res.toSorted((a, b) => {
    if (!a) return 1;
    if (!b) return -1;

    const titleA = a.title
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');
    const titleB = b.title
      .normalize('NFKD')
      .replace(/[^a-zA-Z0-9-\u00C0-\u024F\u4E00-\u9FFF]/g, '');

    return titleA.localeCompare(titleB);
  });

  return { tracks };
};
