import usePlayerStore from '@/stores/usePlayerStore';
import { RepeatMode } from '../../shared/types/vimp';

interface AudioOptions {
  detune?: number;
  playbackRate?: number;
}

class TrackNode {
  private audioContext: AudioContext;
  private src: AudioBufferSourceNode | null;
  private gainNode: GainNode;
  private buffer: AudioBuffer | null;
  private playing: boolean;
  private startTime: number;
  private pauseTime: number;

  constructor(audioContext: AudioContext) {
    this.playing = false;
    this.startTime = 0;
    this.pauseTime = 0;

    this.buffer = null;

    this.audioContext = audioContext;
    this.src = this.audioContext.createBufferSource();
    this.gainNode = this.audioContext.createGain();

    this.src.connect(this.gainNode);
    this.gainNode.gain.value = 1;
  }

  play() {
    if (!this.src) return;

    const offset = this.pauseTime;

    if (offset > 0) {
      this.src = this.audioContext.createBufferSource();
      this.src.connect(this.gainNode);
      if (this.buffer)
        this.loadAudio(this.buffer);
    }

    this.src.start(0, offset);

    this.startTime = this.audioContext.currentTime - offset;
    this.pauseTime = 0;
    this.playing = true;
  }

  pause() {
    if (!this.src) return;

    const elapsed =
      (this.audioContext.currentTime - this.startTime) *
      this.src.playbackRate.value;
    this.src.stop();
    this.pauseTime = elapsed;
    this.playing = false;
  }

  loadAudio(buffer: AudioBuffer, options?: AudioOptions) {
    if (!this.src) return;
    const { repeat } = usePlayerStore.getState();

    this.buffer = buffer;
    this.src.buffer = buffer;
    this.src.loop = repeat === RepeatMode.ONE;

    if (options) {
      this.src.detune.value = options.detune !== undefined ? options.detune : 0;
      this.src.playbackRate.value =
        options.playbackRate !== undefined ? options.playbackRate : 1;
    }
  }

  toggleRepeat(repeat?: RepeatMode) {
    if (!this.src) return;
    if (repeat === RepeatMode.ONE) {
      this.src.loop = true;
    } else {
      this.src.loop = false;
    }
  }

  getCurrentTime() {
    if (this.pauseTime > 0) {
      return this.pauseTime;
    }

    if (this.startTime) {
      return this.audioContext.currentTime - this.startTime;
    }

    return 0;
  }

  isPlaying() {
    return this.playing;
  }

  /*
    AudioBufferSourceNode Helpers
  */
  connect(node: AudioNode) {
    this.gainNode.connect(node);
  }

  disconnect() {
    this.gainNode.disconnect();
  }

  stop(when?: number | undefined) {
    if (!this.src) return;
    this.src.stop(when);
    this.playing = false;
  }
}

export default TrackNode;
