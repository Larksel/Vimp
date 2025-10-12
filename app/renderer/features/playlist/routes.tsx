import { createRoutes } from '@renderer/utils/utils';
import PlaylistView from './pages/PlaylistView';

export const playlistRoutes = createRoutes({
  PLAYLIST: {
    path: 'playlist/:id',
    displayName: 'Playlist',
    element: <PlaylistView />,
  },
});
