import React from 'react'

import './AppBar.css'


export default function AppBar() {
  return (
    <div className="app-bar">
      <button onClick={() => alert('Botão de Ação Clicado')}>Ação</button>
    </div>
  )
}