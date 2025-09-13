import { PlayerConfigService } from '@renderer/features/settings';
import { createRendererLogger } from '@renderer/utils/logger';
import { storeUtils } from '@renderer/utils/storeUtils';
import { Config, RepeatMode } from '@shared/types/vimp';
import { StateCreator } from 'zustand';

const logger = createRendererLogger('ConfigStore');

interface ConfigState extends Config {
  api: {
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

  logger.info('Initializing ConfigStore');

  return {
    player: initialConfig.player,
    musicFolders: initialConfig.musicFolders,
    displayNotifications: initialConfig.displayNotifications,
    api: {
      setAudioShuffle: (shuffle: boolean) => {
        set((state) => ({
          player: { ...state.player, audioShuffle: shuffle },
        }));
        PlayerConfigService.setAudioShuffle(shuffle);
      },
      setAudioRepeatMode: (mode: RepeatMode) => {
        set((state) => ({
          player: { ...state.player, audioRepeatMode: mode },
        }));
        PlayerConfigService.setAudioRepeatMode(mode);
      },
      setAudioMuted: (muted: boolean) => {
        set((state) => ({
          player: { ...state.player, audioMuted: muted },
        }));
        PlayerConfigService.setAudioMuted(muted);
      },
      setGaplessPlayback: (enabled: boolean) => {
        set((state) => ({
          player: { ...state.player, audioGaplessPlayback: enabled },
        }));
        PlayerConfigService.setGaplessPlayback(enabled);
      },
      setCrossfadeDuration: (duration: number) => {
        set((state) => ({
          player: { ...state.player, audioCrossfadeDuration: duration },
        }));
        PlayerConfigService.setCrossfadeDuration(duration);
      },
      setPlaybackRate: (rate: number) => {
        set((state) => ({
          player: { ...state.player, audioPlaybackRate: rate },
        }));
        PlayerConfigService.setPlaybackRate(rate);
      },
      setVolume: (volume: number) => {
        set((state) => ({
          player: { ...state.player, audioVolume: volume },
        }));
        PlayerConfigService.setVolume(volume);
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
