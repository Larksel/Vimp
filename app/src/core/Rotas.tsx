import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ROUTES from "./rotas.json";
import loadable from '@loadable/component'

// Load bundles asynchronously so that the initial render happens faster
const HomePage = loadable(() =>
  import('../paginas/home/HomePage')
);

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