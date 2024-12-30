import log from 'electron-log/renderer';
import { TrackModel } from '@shared/types/vimp';

interface PlayerOptions {
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
}

class Player {
  private readonly audio: HTMLAudioElement;
  private track: TrackModel | null;

  constructor(options?: PlayerOptions) {
    const defaultOptions = {
      playbackRate: 1,
      volume: 1,
      muted: false,
      ...options,
    };

    this.audio = new Audio();
    this.track = null;

    this.audio.defaultPlaybackRate = defaultOptions.playbackRate;
    this.audio.playbackRate = defaultOptions.playbackRate;
    this.audio.volume = defaultOptions.volume;
    this.audio.muted = defaultOptions.muted;
  }

  /**
   * Basic player methods
   */
  async play() {
    if (!this.audio.src) {
      this.stop();
      log.error('[Player] No audio source defined');
      return;
    }
    try {
      await this.audio.play();

      if (this.track && this.track._id && this.track._id !== '') {
        await window.VimpAPI.tracksDB.updateLastPlayed(this.track._id);
        await window.VimpAPI.tracksDB.incrementPlayCount(this.track._id);
        log.debug(`[Player] Playing ${this.track.title}`);
      }
    } catch (err) {
      this.stop();
      log.error('[Player] Player error:\n', err);
    }
  }

  pause() {
    log.debug('[Player] Player paused');
    this.audio.pause();
  }

  stop() {
    log.debug('[Player] Player stoped');
    this.audio.pause();
    this.track = null;
    this.audio.src = '';
  }

  mute() {
    log.debug('[Player] Player muted');
    this.audio.muted = true;
  }

  unmute() {
    log.debug('[Player] Player unmuted');
    this.audio.muted = false;
  }

  /**
   * Get player info
   */
  getAudio() {
    return this.audio;
  }

  getVolume() {
    return this.audio.volume;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  getTrack() {
    return this.track;
  }

  getTrackDuration() {
    return this.audio.duration;
  }

  /**
   * Set player options
   */
  setVolume(volume: number) {
    this.audio.volume = volume;
  }

  setPlaybackRate(playbackRate: number) {
    this.audio.playbackRate = playbackRate;
    this.audio.defaultPlaybackRate = playbackRate;
  }

  setCurrentTime(currentTime: number) {
    this.audio.currentTime = currentTime;
  }

  setTrack(track: TrackModel) {
    if (!track) return;

    let path = track.path;

    // If the path is a local file, ensure that it has the custom protocol
    if (!path.startsWith('vimp://')) {
      path = 'vimp://' + path;
    }

    this.track = track;
    this.audio.src = path;
    log.debug(`[Player] New track defined: ${track.title}`);
  }
}

const { config } = window.VimpAPI;

export default new Player({
  volume: config.__initialConfig['audioVolume'],
  playbackRate: config.__initialConfig['audioPlaybackRate'],
  muted: config.__initialConfig['audioMuted'],
});
