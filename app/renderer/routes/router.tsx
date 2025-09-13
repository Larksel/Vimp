import {
  LoaderFunctionArgs,
  createHashRouter,
  useNavigate,
} from 'react-router-dom';
import RootView from '@renderer/views/RootView';
import HomeView from '@renderer/views/HomeView';
import QueueView from '@renderer/views/QueueView';
import MusicLibraryView from '@renderer/views/MusicLibraryView';
import SettingsView from '@renderer/views/SettingsView';
import PlaylistView from '@renderer/views/PlaylistView';

import routes from './routes';
import DownloaderView from '@renderer/views/DownloaderView';

const router = createHashRouter([
  {
    path: '',
    id: 'root',
    element: <RootView />,
    ErrorBoundary: GlobalErrorBoundary,
    children: [
      {
        index: true,
        path: routes.HOME,
        id: routes.HOME,
        element: <HomeView />,
      },
      {
        path: routes.MUSIC_LIBRARY,
        id: routes.MUSIC_LIBRARY,
        element: <MusicLibraryView />,
      },
      {
        path: routes.QUEUE,
        id: routes.QUEUE,
        element: <QueueView />,
      },
      {
        path: routes.DOWNLOADER,
        id: routes.DOWNLOADER,
        element: <DownloaderView />,
      },
      {
        path: routes.SETTINGS,
        id: routes.SETTINGS,
        element: <SettingsView />,
      },
      {
        path: routes.PLAYLIST,
        id: routes.PLAYLIST,
        element: <PlaylistView />,
      },
    ],
  },
]);

export default router;

function GlobalErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='bg-surface-base flex flex-col items-center justify-center gap-4 rounded-lg p-4'>
        <h1 className='text-2xl'>💥 Pagina não encontrada 💥</h1>
        <button
          className='bg-accent rounded-sm p-2'
          onClick={() => navigate(-1)}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export type LoaderData<T> = T extends (
  args: LoaderFunctionArgs,
) => Promise<infer U>
  ? Exclude<U, Response>
  : never;
