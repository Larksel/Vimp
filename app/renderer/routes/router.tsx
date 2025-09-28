import {
  LoaderFunctionArgs,
  RouterProvider,
  createHashRouter,
  useNavigate,
} from 'react-router-dom';
import MainLayout from '@renderer/layouts/MainLayout';

import { routes } from './routes';
import { useDataLoader } from '@renderer/features/data';

const router = createHashRouter([
  {
    path: '',
    id: 'root',
    element: <MainLayout />,
    ErrorBoundary: GlobalErrorBoundary,
    children: [
      {
        index: true,
        path: routes.HOME.path,
        id: routes.HOME.path,
        element: routes.HOME.element,
      },
      {
        path: routes.MUSIC_LIBRARY.path,
        id: routes.MUSIC_LIBRARY.path,
        element: routes.MUSIC_LIBRARY.element,
      },
      {
        path: routes.QUEUE.path,
        id: routes.QUEUE.path,
        element: routes.QUEUE.element,
      },
      {
        path: routes.DOWNLOADER.path,
        id: routes.DOWNLOADER.path,
        element: routes.DOWNLOADER.element,
      },
      {
        path: routes.SETTINGS.path,
        id: routes.SETTINGS.path,
        element: routes.SETTINGS.element,
      },
      {
        path: routes.PLAYLIST.path,
        id: routes.PLAYLIST.path,
        element: routes.PLAYLIST.element,
      },
    ],
  },
]);

export default function AppRoutes() {
  useDataLoader();

  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: false,
      }}
    />
  );
}

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
