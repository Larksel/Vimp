import { PlayerConfig, RepeatMode } from '@shared/types/vimp';
import log from 'electron-log/renderer';
import debounce from 'lodash/debounce';

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
    log.debug(`[PlayerConfig] Audio shuffle set to ${shuffle}`);
  }, 500),
  setAudioRepeatMode: debounce(async (mode: RepeatMode) => {
    await config.set('audioRepeatMode', mode);
    log.debug(`[PlayerConfig] Audio repeat mode set to ${mode}`);
  }, 500),
  setAudioMuted: debounce(async (muted: boolean) => {
    await config.set('audioMuted', muted);
    log.debug(`[PlayerConfig] Audio muted set to ${muted}`);
  }, 500),
  setGaplessPlayback: debounce(async (enabled: boolean) => {
    await config.set('audioGaplessPlayback', enabled);
    log.debug(`[PlayerConfig] Audio gapless playback set to ${enabled}`);
  }, 500),
  setCrossfadeDuration: debounce(async (duration: number) => {
    await config.set('audioCrossfadeDuration', duration);
    log.debug(`[PlayerConfig] Audio crossfade duration set to ${duration}`);
  }, 500),
  setPlaybackRate: debounce(async (playbackRate: number) => {
    await config.set('audioPlaybackRate', playbackRate);
    log.debug(`[PlayerConfig] Audio playback rate set to ${playbackRate}`);
  }, 500),
  setVolume: debounce(async (volume: number) => {
    await config.set('audioVolume', volume);
    log.debug(`[PlayerConfig] Audio volume set to ${volume}`);
  }, 500),
};
