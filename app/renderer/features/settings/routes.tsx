import { createRoutes } from '@renderer/utils/utils';
import SettingsView from './pages/SettingsView';

export const settingsRoutes = createRoutes({
  SETTINGS: {
    path: 'settings',
    displayName: 'Configurações',
    element: <SettingsView />,
  },
});
