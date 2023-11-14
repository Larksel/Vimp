import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ROUTES from "./rotas.json";
import loadable from '@loadable/component'

import Home from '../paginas/home/Home';

const Carregando = () => {
  return <div>Carregando...</div>
}

// Load bundles asynchronously so that the initial render happens faster
const NoPage = loadable(() =>
  import('../paginas/nopage/NoPage')
);

export default function Rotas() {
  return (
    <div className="App">
      <BrowserRouter basename='/main_window'>
        <Routes>
          <Route path={ROUTES.HOME} index element={<Home />} />
          <Route path={ROUTES.NOPAGE} index element={<NoPage fallback={<Carregando />}/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}