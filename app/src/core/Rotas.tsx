import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
import HomePage from '../views/Home/HomePage';
import MusicLibrary from '../views/MusicLibrary/MusicLibrary';
import ScrollBar from '../componentes/ScrollBar/ScrollBar';
import Header from '../componentes/Header/Header';

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
