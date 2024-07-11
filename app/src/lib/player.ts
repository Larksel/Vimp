import { RepeatMode, TrackModel } from '../../shared/types/vimp';
import usePlayerStore from '@/stores/usePlayerStore';
import TrackNode from './TrackNode';
import debounce from 'lodash/debounce';

interface PlayerOptions {
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
}

class Player {
  private audioContext: AudioContext;
  private volumeNode: GainNode;
  private currentTrackNode: TrackNode | null;
  private track: TrackModel | null;
  private playbackRate: number;
  private muted: boolean;
  private volume: number;
  private audio: HTMLAudioElement;
  private audioSource: MediaElementAudioSourceNode;

  constructor(options?: PlayerOptions) {
    const defaultOptions = {
      playbackRate: 1,
      volume: 1,
      muted: false,
      ...options,
    };

    this.audioContext = new AudioContext();
    this.volumeNode = this.audioContext.createGain();
    this.currentTrackNode = null;
    this.track = null;

    this.playbackRate = defaultOptions.playbackRate;
    this.muted = defaultOptions.muted;
    this.volume = defaultOptions.volume;

    this.volumeNode.connect(this.audioContext.destination);
    this.volumeNode.gain.value = this.muted ? 0 : this.volume;

    this.audio = new Audio();
    this.audio.defaultPlaybackRate = this.playbackRate;
    this.audio.playbackRate = this.playbackRate;
    this.audio.volume = 1;
    this.audio.muted = this.muted;

    this.audioSource = this.audioContext.createMediaElementSource(this.audio);
    this.audioSource.connect(this.volumeNode);
  }

  /**
   * Basic player methods
   */
  async play() {
    if (!this.track || !this.currentTrackNode) {
      this.stop();
      console.log('No audio source defined');
      return;
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      return;
    }
    try {
      this.currentTrackNode.play();

      if (this.track && this.track._id && this.track._id !== '') {
        await window.VimpAPI.db.updateLastPlayed(this.track._id);
        // TODO revalidar rotas
      }
    } catch (err) {
      this.stop();
      console.log('Player error:\n', err);
    }
  }

  async pause() {
    this.audio.pause();
    if (this.audioContext.state === 'running') {
      await this.audioContext.suspend();
    }
  }

  stop() {
    this.audio.pause();
    if (this.currentTrackNode) {
      this.currentTrackNode.stop(0);
      this.currentTrackNode.disconnect();
      this.currentTrackNode = null;
    }
  }

  mute() {
    this.volumeNode.gain.value = 0;
    this.muted = true;
  }

  unmute() {
    this.volumeNode.gain.value = this.volume;
    this.muted = false;
  }

  toggleRepeat(repeat: RepeatMode) {
    this.currentTrackNode?.toggleRepeat(repeat);
  }

  /**
   * Get player info
   */
  getAudio() {
    return this.audio;
  }

  getVolume() {
    return this.volume;
  }

  getCurrentTime() {
    return this.audio.currentTime;
  }

  /**
   * Set player options
   */
  setVolume(volume: number) {
    this.volumeNode.gain.value = volume;
    this.volume = volume;
  }

  setPlaybackRate(playbackRate: number) {
    this.audio.playbackRate = playbackRate;
    this.audio.defaultPlaybackRate = playbackRate;
  }

  setCurrentTime(currentTime: number) {
    this.audio.currentTime = currentTime;
  }

  async setTrack(track: TrackModel) {
    if (!track) return;

    const url = `vimp-music:///${track.path}`;

    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    // TODO cancelar operação caso outra música for escolhida
    if (audioBuffer) {
      if (this.currentTrackNode !== null) {
        this.currentTrackNode.disconnect();
        this.currentTrackNode = null;
      }

      const progressTracker = await this.createProgressTracker();

      if (progressTracker) {
        this.currentTrackNode = new TrackNode(this.audioContext);
        this.currentTrackNode.loadAudio(audioBuffer);
        this.currentTrackNode.connect(progressTracker);
        progressTracker.connect(this.volumeNode);

        progressTracker.port.onmessage = (event) => {
          const position = event.data.position;
          this.debouncedSetProgress(position);
        };
      }

      this.track = track;
      // this.audio.src = url;
    }
  }

  private async createProgressTracker() {
    try {
      const url = new URL('./AudioProgressTracker.ts', import.meta.url);
      await this.audioContext.audioWorklet.addModule(url);
    } catch (e) {
      console.log(e);
      return null;
    }

    return new AudioWorkletNode(this.audioContext, 'AudioProgressTracker');
  }

  private debouncedSetProgress = debounce(
    (progress: number) => {
      if (!this.track?.duration) return;
      if (progress > this.track.duration) {
        progress = progress % this.track.duration;
      }
      usePlayerStore.setState(() => ({ songProgress: progress }));
    },
    50,
    { maxWait: 50 },
  );
}

const { config } = window.VimpAPI;

export default new Player({
  volume: config.__initialConfig['audioVolume'],
  playbackRate: config.__initialConfig['audioPlaybackRate'],
  muted: config.__initialConfig['audioMuted'],
});
