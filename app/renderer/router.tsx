import {
  LoaderFunctionArgs,
  createHashRouter,
  useNavigate,
} from 'react-router-dom';
import HomeView from '@views/HomeView';
import QueueView from '@views/QueueView';
import MusicLibraryView from '@views/MusicLibraryView';
import SettingsView from '@views/SettingsView';
import RootView from '@views/RootView';

import routes from './routes';

const router = createHashRouter([
  {
    path: '',
    id: 'root',
    element: <RootView />,
    loader: RootView.loader,
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
        path: routes.SETTINGS,
        id: routes.SETTINGS,
        element: <SettingsView />,
        loader: SettingsView.loader,
      },
    ],
  },
]);

export default router;

function GlobalErrorBoundary() {
  const navigate = useNavigate();

  return (
    <div className='flex h-screen flex-col items-center justify-center'>
      <div className='flex flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-4'>
        <h1 className='text-2xl'>💥 Pagina não encontrada 💥</h1>
        <button
          className='rounded bg-green-600 p-2'
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
