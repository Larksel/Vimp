import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@emotion/react';
import { tema } from './core/tema';
import CssBaseline from '@mui/material/CssBaseline';
import Rotas from './core/Rotas';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <Rotas />
    </ThemeProvider>
  </StrictMode>
);