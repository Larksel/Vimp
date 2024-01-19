import store from '../store';
import {
  setVolume,
  setIsMuted,
  setIsPlaying,
  setSongProgress,
  setSongDuration,
  setPlaybackRate,
} from '../features/playerSlice';

interface PlayerOptions {
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
}

const state = store.getState().player;

//TODO integrar classe Queue
class Player {
  private audio: HTMLAudioElement;
  private track: string | null;

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

    /**
     * Audio element events
     */
    //TODO Implementar reprodução constante em listas
    this.audio.onplay = () => store.dispatch(store.dispatch(setIsPlaying(true)))
    this.audio.onpause = () => store.dispatch(store.dispatch(setIsPlaying(false)))
    this.audio.onended = () => this.pause();

    this.audio.ondurationchange = () => {
      store.dispatch(setSongDuration(this.audio.duration));
    };
    this.audio.ontimeupdate = () => {
      store.dispatch(setSongProgress(this.audio.currentTime));
    };
  }

  /**
   * Basic player methods
   */
  async play() {
    if (!this.audio.src) {
      this.stop()
      console.log('No audio source defined')
      return;
    }
    try {
      await this.audio.play();
    } catch (err) {
      this.stop()
      console.log('Player error:\n', err)
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
    store.dispatch(setIsMuted(true));
  }

  unmute() {
    this.audio.muted = false;
    store.dispatch(setIsMuted(false));
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
    this.audio.volume = volume / 100;
    store.dispatch(setVolume(volume));
  }

  setPlaybackRate(playbackRate: number) {
    this.audio.playbackRate = playbackRate;
    this.audio.defaultPlaybackRate = playbackRate;
    store.dispatch(setPlaybackRate(playbackRate))
  }

  setCurrentTime(currentTime: number) {
    this.audio.currentTime = currentTime;
    store.dispatch(setSongProgress(currentTime));
  }

  setTrack(track: string) {
    if (!track) return;
    
    //! Remove this on production unless needed
    // If the path is a local file, ensure that it has the custom protocol
    if (!track.startsWith('vimp://') && !track.startsWith('/')) {
      track = 'vimp://' + track
    }

    this.track = track;
    this.audio.src = track;
  }
}

export default new Player({
  playbackRate: state.playbackRate,
  muted: state.isMuted,
  volume: state.volume / 100,
});
