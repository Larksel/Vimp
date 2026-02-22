import { createRoutes } from '@renderer/utils/utils';
import { settingsRoutes } from '@renderer/features/settings/routes';
import { downloaderRoutes } from '@renderer/features/downloader/routes';
import { playlistRoutes } from '@renderer/features/playlist/routes';

import HomeView from '@renderer/views/HomeView';
import MusicLibraryView from '@renderer/views/MusicLibraryView';
import { playerRoutes } from '@renderer/features/player/routes';

const appRoutes = createRoutes({
  HOME: {
    path: 'home',
    displayName: 'Início',
    element: <HomeView />,
  },
  SEARCH: {
    path: 'search',
    displayName: 'Pesquisar',
    element: null,
  },
  MUSIC_LIBRARY: {
    path: 'music_library',
    displayName: 'Biblioteca de Músicas',
    element: <MusicLibraryView />,
  },
  VIDEO_LIBRARY: {
    path: 'video_library',
    displayName: 'Biblioteca de Vídeos',
    element: null,
  },
});

export const routes = {
  ...appRoutes,
  ...playlistRoutes,
  ...downloaderRoutes,
  ...settingsRoutes,
  ...playerRoutes,
} as const;
