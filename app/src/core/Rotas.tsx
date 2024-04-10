import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import HomePage from '../views/Home/HomePage';
import MusicLibrary from '../views/MusicLibrary/MusicLibrary';

export default function Rotas() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MUSIC_LIBRARY} element={<MusicLibrary />} />
    </Routes>
  );
}
