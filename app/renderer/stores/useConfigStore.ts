import { PlayerConfigService } from '@renderer/features/settings';
import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { Config } from '@shared/types/vimp';
import { StateCreator } from 'zustand';

const logger = createRendererLogger('ConfigStore');

interface ConfigState extends Config {
  api: typeof PlayerConfigService;
}

const { config } = window.VimpAPI;

const useConfigStore = createConfigStore<ConfigState>(() => {
  const initialConfig = config.__initialConfig;

  logger.info('Initializing ConfigStore');

  return {
    player: {
      audioShuffle: initialConfig.player.audioShuffle,
      audioRepeatMode: initialConfig.player.audioRepeatMode,
      audioMuted: initialConfig.player.audioMuted,
      audioGaplessPlayback: initialConfig.player.audioGaplessPlayback,
      audioCrossfadeDuration: initialConfig.player.audioCrossfadeDuration,
      audioPlaybackRate: initialConfig.player.audioPlaybackRate,
      audioVolume: initialConfig.player.audioVolume,
    },
    musicFolders: initialConfig.musicFolders,
    displayNotifications: initialConfig.displayNotifications,
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
