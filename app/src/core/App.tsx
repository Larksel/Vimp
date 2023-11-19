import React from 'react'

import Rotas from './Rotas';
import AppBar from '../componentes/appbar/AppBar';

export default function App() {
  return (
    <div className='app'>
      <AppBar />
      <Rotas />
    </div>
  )
}