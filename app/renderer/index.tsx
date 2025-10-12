import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import AppRoutes from './routes/router';

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <AppRoutes />
  </StrictMode>,
);
