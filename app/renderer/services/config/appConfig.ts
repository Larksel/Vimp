import { createRendererLogger } from '@renderer/utils/logger';
import debounce from 'lodash/debounce';

const logger = createRendererLogger('AppConfig');
const { config } = window.VimpAPI;

export const appConfigService = {
  setDisplayNotifications: debounce(async (enabled: boolean) => {
    await config.set('displayNotifications', enabled);
    logger.debug(`Display notifications set to: ${enabled}`);
  }, 500),
};
