import React from 'react';
import ReactDOM from 'react-dom/client';
import Rotas from './core/Rotas';
import { tema } from './core/tema';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <Rotas />
    </ThemeProvider>
  </React.StrictMode>
);