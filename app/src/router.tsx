import { createHashRouter, useNavigate } from 'react-router-dom';
import HomePage from './views/Home/HomePage';
import MusicLibrary from './views/MusicLibrary/MusicLibrary';
import Config from './views/Config/ConfigPage';
import Root from './Root';

import routes from './routes';

//TODO Definir páginas que ficam no "Frame"
//TODO e páginas que ocupam outras partes aplicação
const router = createHashRouter([
  {
    path: '',
    id: 'root',
    element: <Root />,
    ErrorBoundary: GlobalErrorBoundary,
    children: [
      {
        index: true,
        path: routes.HOME,
        id: routes.HOME,
        element: <HomePage />,
      },
      {
        path: routes.MUSIC_LIBRARY,
        id: routes.MUSIC_LIBRARY,
        element: <MusicLibrary />,
      },
      {
        path: routes.CONFIG,
        id: routes.CONFIG,
        element: <Config />,
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
        <h1 className='text-2xl'>💥 Erro: Pagina não encontrada 💥</h1>
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
