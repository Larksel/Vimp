import { getPlayer } from '../lib/player';
import { TrackModel } from '@shared/types/vimp';

const player = getPlayer();

export const PlayerService = {
  play: () => player.play(),
  pause: () => player.pause(),
  stop: () => player.stop(),
  mute: () => player.mute(),
  unmute: () => player.unmute(),
  getAudio: () => player.getAudio(),
  getVolume: () => player.getVolume(),
  getCurrentTime: () => player.getCurrentTime(),
  getTrack: () => player.getTrack(),
  getSampleRate: () => player.getSampleRate(),
  getAnalyzerFftSize: () => player.getAnalyzerFftSize(),
  getAnalyzerBufferSize: () => player.getAnalyzerBufferSize(),
  getAnalyzerTimeDomain: (dataArray: Uint8Array<ArrayBuffer>) =>
    player.getAnalyzerTimeDomain(dataArray),
  getAnalyserFrequency: (dataArray: Uint8Array<ArrayBuffer>) =>
    player.getAnalyserFrequency(dataArray),
  setVolume: (volume: number) => player.setVolume(volume),
  setPlaybackRate: (rate: number) => player.setPlaybackRate(rate),
  setCurrentTime: (progress: number) => player.setCurrentTime(progress),
  setTrack: (track: TrackModel) => player.setTrack(track),
};
