import React from 'react'

import Rotas from './Rotas';
import AppBar from '../componentes/appbar/AppBar';
import Sidebar from '../componentes/sidebar/Sidebar';

export default function App() {
  return (
    <div className='app'>
      <AppBar />
      <Sidebar />
      <Rotas />
    </div>
  )
}