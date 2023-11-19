import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ROUTES from "./rotas.json";
import loadable from '@loadable/component'

import HomePage from '../paginas/home/HomePage';

const Carregando = () => {
  return <div>Carregando...</div>
}

// Load bundles asynchronously so that the initial render happens faster
const ErrorPage = loadable(() =>
  import('../paginas/error/ErrorPage')
);

export default function Rotas() {
  return (
    <BrowserRouter basename='/main_window'>
      <Routes>
        <Route path={ROUTES.HOME} index element={<HomePage />} />
        <Route path={ROUTES.ERRORPAGE} element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}