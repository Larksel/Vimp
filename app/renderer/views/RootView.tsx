import { CSSProperties, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import debounce from 'lodash/debounce';

import AppBar from '@renderer/components/AppBar';
import SideBar from '@renderer/components/SideBar';
import { ScrollArea, ScrollBar } from '@renderer/components/common/scroll-area';
import Header from '@renderer/components/Header';
import PlaybackConsole from '@renderer/components/PlaybackConsole';
import IPCChannels from '@shared/constants/IPCChannels';
import useCurrentTrack from '@renderer/hooks/useCurrentTrack';
import { sortUtils } from '@renderer/utils/sortUtils';
import { useLibraryAPI } from '@renderer/stores/useLibraryStore';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import {
  PlaylistPersistenceService,
  TrackPersistenceService,
} from '@renderer/features/data';
import { createRendererLogger } from '@renderer/utils/logger';

const logger = createRendererLogger('RootView');

export default function RootView() {
  const [collapsed, setCollapsed] = useState(false);
  const track = useCurrentTrack();
  const libraryAPI = useLibraryAPI();
  const playerAPI = usePlayerAPI();

  const loadTracks = async () => {
    logger.debug('Loading tracks');
    const dbTracks = await TrackPersistenceService.getAll();

    const tracks = sortUtils.sortByString(dbTracks, 'title');
    libraryAPI.setTracks(tracks);
    playerAPI.refreshQueueMetadata(tracks);
  };

  const loadPlaylists = async () => {
    logger.debug('Loading playlists');
    const dbPlaylists = await PlaylistPersistenceService.getAll();
    const playlists = sortUtils.sortByString(dbPlaylists, 'title');

    libraryAPI.setPlaylists(playlists);
  };

  useEffect(() => {
    window.VimpAPI.app.onDBChanged(
      debounce(() => {
        logger.debug('DB changed');
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
