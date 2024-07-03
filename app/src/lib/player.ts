import { TrackModel } from '../../shared/types/vimp';
import TrackNode from './TrackNode';

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
  // !TODO remove after transition to web audio api
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

    // !TODO remove after transition to web audio api
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
    try {
      this.currentTrackNode.start(0);

      if (this.track && this.track._id && this.track._id !== '') {
        await window.VimpAPI.db.updateLastPlayed(this.track._id);
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
    this.volumeNode.gain.value = 0;
    this.muted = true;
  }

  unmute() {
    this.volumeNode.gain.value = this.volume;
    this.muted = false;
  }

  /**
   * Get player info
   */
  // !TODO remove after transition to web audio api
  getAudio() {
    return this.audio;
  }

  getVolume() {
    return this.volume;
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

    // Converts path to base64 to be used in the request
    const encodedPath = btoa(track.path);
    const url = `vimp-music://${encodedPath}`;

    const res = await fetch(url);
    const audioBuffer = await this.decodeAudioStream(this.audioContext, res.body);

    // TODO cancelar operação caso outra música for escolhida
    if (audioBuffer) {
      if (this.currentTrackNode !== null) {
        this.currentTrackNode.disconnect();
        this.currentTrackNode = null;
      }
      
      this.currentTrackNode = new TrackNode({
        src: this.audioContext.createBufferSource(),
        gainNode: this.audioContext.createGain()
      })
      
      this.currentTrackNode.loadAudio({
        buffer: audioBuffer,
        loop: true,
        playbackRate: 1
      })

      this.currentTrackNode.connect(this.volumeNode);
  
      this.track = track;
      // this.audio.src = url;
    }
  }

  private async decodeAudioStream(
    audioContext: AudioContext,
    stream: ReadableStream<Uint8Array> | null,
  ) {
    if (!stream) return;

    const reader = stream.getReader();
    const chunks: Uint8Array[] = [];
    let totalLength = 0;

    while (true) {
      const { done, value } = await reader?.read();
      if (done) {
        if (value) chunks.push(value);
        break;
      }

      chunks.push(value);
      totalLength += value.length;
    }

    const audioData = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      audioData.set(chunk, offset);
      offset += chunk.length;
    }

    return audioContext.decodeAudioData(audioData.buffer);
  }
}

const { config } = window.VimpAPI;

export default new Player({
  volume: config.__initialConfig['audioVolume'],
  playbackRate: config.__initialConfig['audioPlaybackRate'],
  muted: config.__initialConfig['audioMuted'],
});
