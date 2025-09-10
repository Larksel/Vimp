import { createRendererLogger } from '@renderer/utils/logger';
import { PlayerConfig, RepeatMode } from '@shared/types/vimp';
import debounce from 'lodash/debounce';

const logger = createRendererLogger('PlayerConfig');
const { config } = window.VimpAPI;

export const PlayerConfigService = {
  getInitialConfig: (): PlayerConfig => ({
    audioShuffle: config.__initialConfig['audioShuffle'],
    audioRepeatMode: config.__initialConfig['audioRepeatMode'],
    audioMuted: config.__initialConfig['audioMuted'],
    audioGaplessPlayback: config.__initialConfig['audioGaplessPlayback'],
    audioCrossfadeDuration: config.__initialConfig['audioCrossfadeDuration'],
    audioPlaybackRate: config.__initialConfig['audioPlaybackRate'],
    audioVolume: config.__initialConfig['audioVolume'],
  }),
  setAudioShuffle: debounce(async (shuffle: boolean) => {
    await config.set('audioShuffle', shuffle);
    logger.debug(`Audio shuffle set to ${shuffle}`);
  }, 500),
  setAudioRepeatMode: debounce(async (mode: RepeatMode) => {
    await config.set('audioRepeatMode', mode);
    logger.debug(`Audio repeat mode set to ${mode}`);
  }, 500),
  setAudioMuted: debounce(async (muted: boolean) => {
    await config.set('audioMuted', muted);
    logger.debug(`Audio muted set to ${muted}`);
  }, 500),
  setGaplessPlayback: debounce(async (enabled: boolean) => {
    await config.set('audioGaplessPlayback', enabled);
    logger.debug(`Audio gapless playback set to ${enabled}`);
  }, 500),
  setCrossfadeDuration: debounce(async (duration: number) => {
    await config.set('audioCrossfadeDuration', duration);
    logger.debug(`Audio crossfade duration set to ${duration}`);
  }, 500),
  setPlaybackRate: debounce(async (playbackRate: number) => {
    await config.set('audioPlaybackRate', playbackRate);
    logger.debug(`Audio playback rate set to ${playbackRate}`);
  }, 500),
  setVolume: debounce(async (volume: number) => {
    await config.set('audioVolume', volume);
    logger.debug(`Audio volume set to ${volume}`);
  }, 500),
};
