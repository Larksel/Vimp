import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { ThemeProvider } from '@emotion/react';
import { tema } from './configs/tema';
import CssBaseline from '@mui/material/CssBaseline';

import App from './core/App';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <ThemeProvider theme={tema}>
      <CssBaseline enableColorScheme />
      <App />
    </ThemeProvider>
  </StrictMode>
);
