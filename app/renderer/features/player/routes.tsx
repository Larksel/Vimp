import { createRoutes } from '@renderer/utils/utils';
import ExpandedView from './pages/ExpandedView';
import QueueView from './pages/QueueView';

export const playerRoutes = createRoutes({
  EXPANDED_VIEW: {
    path: 'expanded_view',
    displayName: 'Visão Expandida',
    element: <ExpandedView />,
  },
  QUEUE: {
    path: 'queue',
    displayName: 'Fila de Reprodução',
    element: <QueueView />,
  },
});
