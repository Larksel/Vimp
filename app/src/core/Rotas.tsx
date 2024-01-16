import { Routes, Route } from 'react-router-dom';
import ROUTES from './routes';
//import loadable from '@loadable/component'
import HomePage from '../paginas/Home/HomePage';

// Load bundles asynchronously so that the initial render happens faster
/*
  const HomePage = loadable(() =>
    import('../paginas/Home/HomePage')
  );
*/

//TODO probleminha chato aqui

export default function Rotas() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} index element={<HomePage />} />
    </Routes>
  );
}
