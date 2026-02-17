import { createRendererLogger } from '@renderer/utils/logger';
import { TrackModel } from '@shared/types/vimp';
import { TrackPersistenceService } from '@renderer/features/data';
import useConfigStore from '@renderer/stores/useConfigStore';
import useLibraryStore from '@renderer/stores/useLibraryStore';

const logger = createRendererLogger('Player');

interface Player {
  play: () => void;
  pause: () => void;
  stop: () => void;
  mute: () => void;
  unmute: () => void;
  getAudio: () => void;
  getVolume: () => void;
  getCurrentTime: () => void;
  getTrack: () => void;
  getSampleRate: () => void;
  getAnalyzerFftSize: () => void;
  getAnalyzerBufferSize: () => void;
  getAnalyzerTimeDomain: (dataArray: Uint8Array<ArrayBuffer>) => void;
  getAnalyserFrequency: (dataArray: Uint8Array<ArrayBuffer>) => void;
  setVolume: (volume: number) => void;
  setPlaybackRate: (playbackRate: number) => void;
  setCurrentTime: (currentTime: number) => void;
  setTrack: (track: TrackModel) => void;
  freeSrcObject: () => void;
}

function createPlayer(): Player {
  const config = useConfigStore.getState().player;
  const playerConfig = {
    playbackRate: config.audioPlaybackRate ?? 1,
    volume: config.audioVolume ?? 1,
    muted: config.audioMuted ?? false,
  };

  let audio: HTMLAudioElement | null = null;
  let audioCtx: AudioContext | null = null;
  let audioSource: MediaElementAudioSourceNode | null = null;
  let analyser: AnalyserNode | null = null;
  let gainNode: GainNode | null = null;
  // Volume is squared to provide a more natural volume scaling
  const volume = Math.min(playerConfig.volume ** 2, 1);
  let track: TrackModel | null = null;
  let hasPlayed = false;

  audio = new Audio();
  audioCtx = new AudioContext();
  audioCtx.suspend();
  audioSource = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  gainNode = audioCtx.createGain();

  // Analyser configuration
  analyser.fftSize = 4096;
  analyser.smoothingTimeConstant = 0.5;
  analyser.maxDecibels = -10;
  analyser.minDecibels = -75;

  gainNode.gain.value = playerConfig.muted ? 0 : volume;
  // Mantain full volume to keep analysis consistent
  audio.volume = 1;
  audio.defaultPlaybackRate = playerConfig.playbackRate;
  audio.playbackRate = playerConfig.playbackRate;

  // Conecting all nodes
  // Audio -> Analyzer -> Gain -> Output
  audioSource.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  return {
    /**
     * Basic player methods
     */
    async play() {
      if (!audio.src) {
        this.stop();
        logger.error('No audio source defined');
        return;
      }

      if (!track) {
        this.stop();
        logger.error('No track defined');
        return;
      }

      await audioCtx.resume();
      await audio.play();

      if (!hasPlayed && track._id && track._id !== '') {
        logger.info(`Playing ${track.path}`);
        const updatedTrack: TrackModel = {
          ...track,
          lastPlayed: new Date(),
          playCount: track.playCount + 1,
        };

        useLibraryStore.getState().api.updateLocalTrack(updatedTrack);

        await TrackPersistenceService.updateLastPlayed(track._id);
        await TrackPersistenceService.incrementPlayCount(track._id);

        hasPlayed = true;
      } else {
        logger.debug('Resuming track');
      }
    },

    pause() {
      logger.debug('Player paused');
      audio.pause();
      audioCtx.suspend();
    },

    stop() {
      logger.debug('Player stopped');
      audio.pause();
      track = null;
      audio.src = '';
      audioCtx.suspend();
    },

    mute() {
      logger.debug('Player muted');
      gainNode.gain.value = 0;
    },

    unmute() {
      logger.debug('Player unmuted');
      gainNode.gain.value = volume;
    },

    /**
     * Get player info
     */
    getAudio() {
      return audio;
    },

    getVolume() {
      return volume;
    },

    getCurrentTime() {
      return audio.currentTime;
    },

    getTrack() {
      return track;
    },

    getSampleRate() {
      return audioCtx.sampleRate;
    },

    getAnalyzerFftSize() {
      return analyser.fftSize;
    },

    getAnalyzerBufferSize() {
      return analyser.frequencyBinCount;
    },

    getAnalyzerTimeDomain(dataArray: Uint8Array<ArrayBuffer>) {
      analyser.getByteTimeDomainData(dataArray);
    },

    getAnalyserFrequency(dataArray: Uint8Array<ArrayBuffer>) {
      analyser.getByteFrequencyData(dataArray);
    },

    /**
     * Set player options
     */
    setVolume(volume: number) {
      // Volume is squared to provide a more natural volume scaling
      const newVolume = Math.min(volume ** 2, 1);
      gainNode.gain.value = newVolume;
      volume = newVolume;
    },

    setPlaybackRate(playbackRate: number) {
      audio.playbackRate = playbackRate;
      audio.defaultPlaybackRate = playbackRate;
    },

    setCurrentTime(currentTime: number) {
      audio.currentTime = currentTime;
    },

    async setTrack(trackModel: TrackModel) {
      if (!trackModel) return;

      this.freeSrcObject();

      track = trackModel;
      hasPlayed = false;
      logger.info(`Loading new track: ${trackModel.path}`);

      await window.VimpAPI.fileSystem
        .loadAudioFile(trackModel.path)
        .then((audioBuffer: ArrayBuffer) => {
          const audioBlob = new Blob([audioBuffer], { type: 'audio/*' });
          const objectURL = URL.createObjectURL(audioBlob);

          audio.src = objectURL;

          logger.info('Audio loaded');
        })
        .catch((error: Error) => {
          logger.error(`Error loading audio for player: ${error.message}`);
        });
    },

    freeSrcObject() {
      if (audio.src && audio.src.startsWith('blob:')) {
        revokeObjectURL(audio.src);
      }
    },
  };
}

// Isso é importante para liberar memória
function revokeObjectURL(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

// Singleton
let instance: Player | null = null;

export function getPlayer() {
  if (import.meta.hot) {
    instance = import.meta.hot.data.player ?? instance;
    if (!instance) {
      instance = createPlayer();
      import.meta.hot.data.player = instance;
    }
    import.meta.hot.dispose(() => {
      // opcional: remover listeners externos; não destruir o contexto
    });
    return instance;
  }

  if (!instance) instance = createPlayer();
  return instance;
}
