import React from 'react';
import ReactDOM from 'react-dom/client';
import Rotas from './Rotas';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import { tema } from './estilos/tema';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <Rotas />
    </ThemeProvider>
  </React.StrictMode>
);