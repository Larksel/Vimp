import { createRoutes } from '@renderer/utils/utils';
import { settingsRoutes } from '@renderer/features/settings';
import { downloaderRoutes } from '@renderer/features/downloader';
import { playlistRoutes } from '@renderer/features/playlist';

import HomeView from '@renderer/views/HomeView';
import MusicLibraryView from '@renderer/views/MusicLibraryView';
import QueueView from '@renderer/views/QueueView';
import { playerRoutes } from '@renderer/features/player';

const appRoutes = createRoutes({
  HOME: {
    path: 'home',
    displayName: 'Início',
    element: <HomeView />,
  },
  QUEUE: {
    path: 'queue',
    displayName: 'Fila de Reprodução',
    element: <QueueView />,
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
