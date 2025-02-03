import { CSSProperties, useEffect, useState } from 'react';
import log from 'electron-log/renderer';
import { Outlet } from 'react-router-dom';
import debounce from 'lodash/debounce';

import AppBar from '@components/AppBar';
import SideBar from '@components/SideBar';
import { ScrollArea, ScrollBar } from '@components/common/scroll-area';
import Header from '@components/Header';
import PlaybackConsole from '@components/PlaybackConsole';
import IPCChannels from '@shared/constants/IPCChannels';
import useCurrentTrack from '@hooks/useCurrentTrack';
import { sortByName } from '@render-utils/utils-sort';
import { useLibraryAPI } from '@stores/useLibraryStore';
import { usePlayerAPI } from '@stores/usePlayerStore';

export default function RootView() {
  const [collapsed, setCollapsed] = useState(false);
  const track = useCurrentTrack();
  const libraryAPI = useLibraryAPI();
  const playerAPI = usePlayerAPI();

  const loadTracks = async () => {
    log.debug('[RootView] Loading tracks');
    const res = await window.VimpAPI.tracksDB.getAll();

    const tracks = sortByName(res, 'title');
    libraryAPI.setTracks(tracks);
    playerAPI.updateQueue(tracks);
  };

  const loadPlaylists = async () => {
    log.debug('[RootView] Loading playlists');
    const res = await window.VimpAPI.playlistsDB.getAll();
    const playlists = sortByName(res, 'title');

    libraryAPI.setPlaylists(playlists);
  };

  useEffect(() => {
    window.VimpAPI.app.onDBChanged(
      debounce(() => {
        log.debug('[RootView] DB changed');
        loadTracks();
        loadPlaylists();
      }, 500),
    );

    loadTracks();
    loadPlaylists();

    return function cleanup() {
      window.VimpAPI.app.removeAllListeners(IPCChannels.DB_HAS_CHANGED);
    };
  }, []);

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

      <div className='flex h-(--content-height) gap-2 overflow-clip p-2 transition-all'>
        <SideBar
          toggle={() => setCollapsed(!collapsed)}
          collapsed={collapsed}
        />

        <div className='bg-surface-base relative overflow-clip rounded-lg'>
          <Header />
          <ScrollArea className='relative h-full w-full'>
            <div className='h-full w-(--content-width) p-4 pt-16 transition-all *:h-full'>
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
