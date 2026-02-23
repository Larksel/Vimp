import {
  appConfigService,
  playerConfigService,
} from '@renderer/services/config';
import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { Config, RepeatMode } from '@shared/types/vimp';
import { StateCreator } from 'zustand';

const logger = createRendererLogger('ConfigStore');

interface ConfigState extends Config {
  api: {
    setDisplayNotifications: (enabled: boolean) => void;
    setAudioShuffle: (shuffle: boolean) => void;
    setAudioRepeatMode: (mode: RepeatMode) => void;
    setAudioMuted: (muted: boolean) => void;
    setGaplessPlayback: (enabled: boolean) => void;
    setCrossfadeDuration: (duration: number) => void;
    setPlaybackRate: (rate: number) => void;
    setVolume: (volume: number) => void;
  };
}

const { config } = window.VimpAPI;

const useConfigStore = createConfigStore<ConfigState>((set) => {
  const initialConfig = config.__initialConfig;

  logger.debug(
    `Initializing ConfigStore with config: ${JSON.stringify(initialConfig, null, 2)}`,
  );

  return {
    player: initialConfig.player,
    musicFolders: initialConfig.musicFolders,
    displayNotifications: initialConfig.displayNotifications,
    api: {
      setDisplayNotifications: (enabled) => {
        appConfigService.setDisplayNotifications(enabled);
        set({ displayNotifications: enabled });
      },
      setAudioShuffle: (shuffle: boolean) => {
        set((state) => ({
          player: { ...state.player, audioShuffle: shuffle },
        }));
        playerConfigService.setAudioShuffle(shuffle);
      },
      setAudioRepeatMode: (mode: RepeatMode) => {
        set((state) => ({
          player: { ...state.player, audioRepeatMode: mode },
        }));
        playerConfigService.setAudioRepeatMode(mode);
      },
      setAudioMuted: (muted: boolean) => {
        set((state) => ({
          player: { ...state.player, audioMuted: muted },
        }));
        playerConfigService.setAudioMuted(muted);
      },
      setGaplessPlayback: (enabled: boolean) => {
        set((state) => ({
          player: { ...state.player, audioGaplessPlayback: enabled },
        }));
        playerConfigService.setGaplessPlayback(enabled);
      },
      setCrossfadeDuration: (duration: number) => {
        set((state) => ({
          player: { ...state.player, audioCrossfadeDuration: duration },
        }));
        playerConfigService.setCrossfadeDuration(duration);
      },
      setPlaybackRate: (rate: number) => {
        set((state) => ({
          player: { ...state.player, audioPlaybackRate: rate },
        }));
        playerConfigService.setPlaybackRate(rate);
      },
      setVolume: (volume: number) => {
        set((state) => ({
          player: { ...state.player, audioVolume: volume },
        }));
        playerConfigService.setVolume(volume);
      },
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
