import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './paginas/Home'
import NoPage from './paginas/NoPage'

export default function Rotas() {
  return (
    <div className="App">
      <BrowserRouter basename='/main_window'>
        <Routes>
          <Route path='/' index element={<Home />} />
          <Route path='*' index element={<NoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}