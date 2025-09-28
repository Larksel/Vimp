import { createRoutes } from '@renderer/utils/utils';
import ExpandedView from './pages/ExpandedView';

export const playerRoutes = createRoutes({
  EXPANDED_VIEW: {
    path: 'expanded_view',
    displayName: 'Visão Expandida',
    element: <ExpandedView />,
  },
});
