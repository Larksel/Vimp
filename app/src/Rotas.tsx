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
}

export default function Rotas({ className }) {
  return (
    <div className={className}>
      <Header />
      <ScrollBar>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.MUSIC_LIBRARY} element={<MusicLibrary />} />
        </Routes>
      </ScrollBar>
    </div>
  );
}
