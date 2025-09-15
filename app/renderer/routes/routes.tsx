import { createRoutes } from '@renderer/utils/utils';
import { settingsRoutes } from '@renderer/features/settings';
import { downloaderRoutes } from '@renderer/features/downloader';

import HomeView from '@renderer/views/HomeView';
import MusicLibraryView from '@renderer/views/MusicLibraryView';
import PlaylistView from '@renderer/views/PlaylistView';
import QueueView from '@renderer/views/QueueView';

const appRoutes = createRoutes({
  HOME: {
    path: '',
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
  PLAYLIST: {
    path: 'playlist/:id',
    displayName: 'Coleção',
    element: <PlaylistView />,
  },
});

export const routes = {
  ...appRoutes,
  ...downloaderRoutes,
  ...settingsRoutes,
} as const;
