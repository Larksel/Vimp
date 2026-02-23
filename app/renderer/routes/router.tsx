import {
  LoaderFunctionArgs,
  Navigate,
  Route,
  RouterProvider,
  createHashRouter,
  createRoutesFromElements,
  useNavigate,
} from 'react-router-dom';
import MainLayout from '@renderer/routes/layouts/MainLayout';
import FullLayout from '@renderer/routes/layouts/FullLayout';

import { routes } from './routes';
import useDataLoader from '@renderer/hooks/useDataLoader';

const router = createHashRouter(
  createRoutesFromElements(
    <>
      {/* Layout principal com SideBar, Console, AppBar, etc */}
      <Route
        path=''
        element={<MainLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.HOME} />
        <Route {...routes.MUSIC_LIBRARY} />
        <Route {...routes.QUEUE} />
        <Route {...routes.DOWNLOADER} />
        <Route {...routes.SETTINGS} />
        <Route {...routes.PLAYLIST} />

        <Route index element={<Navigate to={routes.HOME.path} />} />
      </Route>
      {/* Layout de tela inteira mais o PlaybackConsole */}
      <Route
        path=''
        element={<FullLayout />}
        errorElement={<GlobalErrorBoundary />}
      >
        <Route {...routes.EXPANDED_VIEW} />
      </Route>
    </>,
  ),
);

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
