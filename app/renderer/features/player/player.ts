import { createRendererLogger } from '@renderer/utils/logger';
import { TrackModel } from '@shared/types/vimp';
import { TrackPersistenceService } from '@renderer/features/data';

const logger = createRendererLogger('Player');

interface PlayerOptions {
  playbackRate?: number;
  volume?: number;
  muted?: boolean;
}

class Player {
  private readonly audio: HTMLAudioElement;
  private readonly audioCtx: AudioContext;
  private readonly audioSource: MediaElementAudioSourceNode;
  private readonly analyser: AnalyserNode;
  private readonly gainNode: GainNode;
  private volume: number;
  private track: TrackModel | null;
  protected hasPlayed: boolean;

  constructor(options?: PlayerOptions) {
    const defaultOptions = {
      playbackRate: 1,
      volume: 1,
      muted: false,
      ...options,
    };

    this.volume = defaultOptions.volume;
    this.audio = new Audio();
    this.audioCtx = new AudioContext();
    this.audioSource = this.audioCtx.createMediaElementSource(this.audio);
    this.analyser = this.audioCtx.createAnalyser();
    this.gainNode = this.audioCtx.createGain();

    // Conecting all nodes
    this.audioSource.connect(this.analyser);
    this.analyser.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    // Analyser configuration
    this.analyser.fftSize = 4096;
    this.analyser.smoothingTimeConstant = 0.65;
    this.analyser.maxDecibels = -10;
    this.analyser.minDecibels = -75;

    this.track = null;
    this.hasPlayed = false;

    this.gainNode.gain.value = defaultOptions.muted ? 0 : this.volume;
    this.audio.volume = 1;
    this.audio.defaultPlaybackRate = defaultOptions.playbackRate;
    this.audio.playbackRate = defaultOptions.playbackRate;
  }

  /**
   * Basic player methods
   */
  async play() {
    if (!this.audio.src) {
      this.stop();
      logger.error('No audio source defined');
      return;
    }

    if (!this.track) {
      this.stop();
      logger.error('No track defined');
      return;
    }

    await this.audioCtx.resume();
    await this.audio.play();
    logger.info(`Playing ${this.track.path}`);

    if (!this.hasPlayed && this.track._id && this.track._id !== '') {
      await TrackPersistenceService.updateLastPlayed(this.track._id);
      await TrackPersistenceService.incrementPlayCount(this.track._id);
      this.hasPlayed = true;
    }
  }

  pause() {
    logger.debug('Player paused');
    this.audio.pause();
    this.audioCtx.suspend();
  }

  stop() {
    logger.debug('Player stopped');
    this.audio.pause();
    this.track = null;
    this.audio.src = '';
    this.audioCtx.suspend();
  }

  mute() {
    logger.debug('Player muted');
    this.gainNode.gain.value = 0;
  }

  unmute() {
    logger.debug('Player unmuted');
    this.gainNode.gain.value = this.volume;
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

  getTrack() {
    return this.track;
  }

  getBufferSize() {
    return this.analyser.frequencyBinCount;
  }

  getAnalyserData(dataArray: Uint8Array) {
    this.analyser.getByteFrequencyData(dataArray);
  }

  /**
   * Set player options
   */
  setVolume(volume: number) {
    this.gainNode.gain.value = volume;
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

    this.freeSrcObject();

    this.track = track;
    this.hasPlayed = false;
    logger.info(`Loading new track: ${track.path}`);

    await window.VimpAPI.fileSystem
      .loadAudioFile(track.path)
      .then((audioBuffer: ArrayBuffer) => {
        const audioBlob = new Blob([audioBuffer], { type: 'audio/*' });
        const objectURL = URL.createObjectURL(audioBlob);

        this.audio.src = objectURL;

        logger.info('Audio loaded');
      })
      .catch((error: Error) => {
        logger.error(`Error loading audio for player: ${error.message}`);
      });
  }

  freeSrcObject() {
    if (this.audio.src && this.audio.src.startsWith('blob:')) {
      revokeObjectURL(this.audio.src);
    }
  }
}

// Isso é importante para liberar memória
function revokeObjectURL(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

const { config } = window.VimpAPI;

export default new Player({
  volume: config.__initialConfig['audioVolume'],
  playbackRate: config.__initialConfig['audioPlaybackRate'],
  muted: config.__initialConfig['audioMuted'],
});
