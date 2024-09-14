import { TrackModel } from '../../shared/types/vimp';

interface PlayerOptions {
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
}

class Player {
  private audio: HTMLAudioElement;
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
      console.log('No audio source defined');
      return;
    }
    try {
      await this.audio.play();

      if (this.track && this.track._id && this.track._id !== '') {
        await window.VimpAPI.db.updateLastPlayed(this.track._id);
        //TODO implementar threshold
        await window.VimpAPI.db.incrementPlayCount(this.track._id);
        // TODO revalidar rotas
      }
    } catch (err) {
      this.stop();
      console.log('Player error:\n', err);
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
  }

  mute() {
    this.audio.muted = true;
  }

  unmute() {
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
  }
}

const { config } = window.VimpAPI;

export default new Player({
  volume: config.__initialConfig['audioVolume'],
  playbackRate: config.__initialConfig['audioPlaybackRate'],
  muted: config.__initialConfig['audioMuted'],
});
