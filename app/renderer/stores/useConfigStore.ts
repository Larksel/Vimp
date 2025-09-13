import { PlayerConfigService } from '@renderer/features/settings';
import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { Config, RepeatMode } from '@shared/types/vimp';
import { StateCreator } from 'zustand';

const logger = createRendererLogger('ConfigStore');

interface ConfigState extends Config {
  api: typeof PlayerConfigService;
}

const useConfigStore = createConfigStore<ConfigState>(() => {
  logger.info('Initializing ConfigStore');
  
  return {
    musicFolders: [''],
    displayNotifications: false,
    audioVolume: 0,
    audioPlaybackRate: 0,
    audioMuted: false,
    audioShuffle: false,
    audioRepeatMode: RepeatMode.ONE,
    audioGaplessPlayback: false,
    audioCrossfadeDuration: 0,
    api: {
      ...PlayerConfigService,
    },
  };
});

export default useConfigStore;

export function useConfigAPI() {
  return useConfigStore((state) => state.api);
}

function createConfigStore<T extends ConfigState>(store: StateCreator<T>) {
  return storeUtils.createStore(store);
}
