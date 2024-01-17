import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
//import loadable from '@loadable/component'
import HomePage from '../paginas/Home/HomePage';
import MusicLibrary from '../paginas/MusicLibrary/MusicLibrary';

// Load bundles asynchronously so that the initial render happens faster
/*
  const HomePage = loadable(() =>
    import('../paginas/Home/HomePage')
  );
*/

export default function Rotas() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.MUSIC_LIBRARY} element={<MusicLibrary />} />
    </Routes>
  );
}
