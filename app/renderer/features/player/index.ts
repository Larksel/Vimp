import player from './player';
import { TrackModel } from '@shared/types/vimp';

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
  getBufferSize: () => player.getBufferSize(),
  getAnalyserData: (dataArray: Uint8Array) => player.getAnalyserData(dataArray),
  setVolume: (volume: number) => player.setVolume(volume),
  setPlaybackRate: (rate: number) => player.setPlaybackRate(rate),
  setCurrentTime: (progress: number) => player.setCurrentTime(progress),
  setTrack: async (track: TrackModel) => await player.setTrack(track),
};
