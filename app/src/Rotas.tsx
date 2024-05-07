import { Routes, Route } from 'react-router-dom';
import HomePage from './views/Home/HomePage';
import MusicLibrary from './views/MusicLibrary/MusicLibrary';
import ScrollBar from './componentes/ScrollBar/ScrollBar';
import Header from './componentes/Header/Header';

export const ROUTES = {
  HOME: '/home',
  QUEUE: '/queue',
  SEARCH: '/search',
  MUSIC_LIBRARY: '/music_library',
  VIDEO_LIBRARY: '/video_library',
};

export default function Rotas() {
  return (
    <div className='relative col-span-3 row-span-2 overflow-clip rounded-lg bg-neutral-800'>
      <Header />
      <ScrollBar>
        <div className='h-full w-[calc(100vw-24px-var(--sidebar-width))] p-4 pt-16 transition-all'>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.MUSIC_LIBRARY} element={<MusicLibrary />} />
          </Routes>
        </div>
      </ScrollBar>
    </div>
  );
}
