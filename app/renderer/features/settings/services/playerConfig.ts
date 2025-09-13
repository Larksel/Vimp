import { createRendererLogger } from '@renderer/utils/logger';
import { RepeatMode } from '@shared/types/vimp';
import debounce from 'lodash/debounce';

const logger = createRendererLogger('PlayerConfig');
const { config } = window.VimpAPI;

const getCurrentPlayerConfig = async () => {
  return await config.get('player');
};

export const PlayerConfigService = {
  getInitialConfig: () => config.__initialConfig.player,

  setAudioShuffle: debounce(async (shuffle: boolean) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', { ...playerConfig, audioShuffle: shuffle });
    logger.debug(`Audio shuffle set to ${shuffle}`);
  }, 500),

  setAudioRepeatMode: debounce(async (mode: RepeatMode) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', { ...playerConfig, audioRepeatMode: mode });
    logger.debug(`Audio repeat mode set to ${mode}`);
  }, 500),

  setAudioMuted: debounce(async (muted: boolean) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', { ...playerConfig, audioMuted: muted });
    logger.debug(`Audio muted set to ${muted}`);
  }, 500),

  setGaplessPlayback: debounce(async (enabled: boolean) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', {
      ...playerConfig,
      audioGaplessPlayback: enabled,
    });
    logger.debug(`Audio gapless playback set to ${enabled}`);
  }, 500),

  setCrossfadeDuration: debounce(async (duration: number) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', {
      ...playerConfig,
      audioCrossfadeDuration: duration,
    });
    logger.debug(`Audio crossfade duration set to ${duration}`);
  }, 500),

  setPlaybackRate: debounce(async (playbackRate: number) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', {
      ...playerConfig,
      audioPlaybackRate: playbackRate,
    });
    logger.debug(`Audio playback rate set to ${playbackRate}`);
  }, 500),

  setVolume: debounce(async (volume: number) => {
    const playerConfig = await getCurrentPlayerConfig();
    await config.set('player', { ...playerConfig, audioVolume: volume });
    logger.debug(`Audio volume set to ${volume}`);
  }, 500),
};
