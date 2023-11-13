import * as React from 'react';
import { createRoot } from 'react-dom/client';
/*import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@emotion/react';
import { tema } from './estilos/Tema';*/

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    {/*
    <ThemeProvider theme={tema}>
      <CssBaseline />
      <Rotas />
    </ThemeProvider>
    */}
    <h1>Hello World!</h1>
  </React.StrictMode>
);
