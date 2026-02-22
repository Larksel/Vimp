import { AudioData } from './types';
import usePlayerStore from '@renderer/stores/usePlayerStore';
import { PlayerStatus } from '@shared/types/vimp';
import {
  followEnvelope,
  getFrequencyEndIndex,
  getInterpolatedValue,
  getRMS,
} from './utils/audioMath';
import { getPlayer, Player } from '../player';

type AudioListener = (data: AudioData, frameCount: number) => void;

// TODO Suavização baseada no FPS (multiplicar)
const FPS = 60;
const FRAME_TIME = 1000 / FPS;

/**
 * Gerencia os listeners e os notifica com os dados de áudio em tempo real.
 */
class AudioDispatcher {
  private player: Player;
  constructor(player: Player) {
    this.player = player;
  }

  private listeners = new Set<AudioListener>();
  private animationFrameId: number | null = null;
  private frameCount = 0;
  private lastTime = 0;

  // Linha de corte das frequências (Hz)
  private minFrequency = 40;
  private bassCutoff = 150;
  private midCutoff = 4000;
  private maxFrequency = 16000;
  private frequencyIndices = {
    min: getFrequencyEndIndex(this.minFrequency),
    bass: getFrequencyEndIndex(this.bassCutoff),
    mids: getFrequencyEndIndex(this.midCutoff),
    max: getFrequencyEndIndex(this.maxFrequency),
  };

  public numPoints = 240;
  private dataArraySize = this.frequencyIndices.max;
  private frequencyArray = new Uint8Array(this.dataArraySize);
  private timeDomainArray = new Uint8Array(this.dataArraySize);

  private audioData: AudioData = {
    rmsLevel: 0,
    bass: 0,
    mids: 0,
    trebles: 0,
    frequencyData: new Float32Array(this.numPoints),
  };

  // Core functions

  subscribe(callback: AudioListener) {
    this.listeners.add(callback);
    if (!this.animationFrameId) this.start();
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) this.stop();
    };
  }

  private start() {
    if (this.animationFrameId) return;
    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  private stop() {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.animationFrameId = null;
  }

  private loop = (time: number) => {
    if (time - this.lastTime >= FRAME_TIME) {
      this.lastTime = time;
      this.frameCount++;
      this.updateAudioData();

      this.listeners.forEach((listener) =>
        listener(this.audioData, this.frameCount),
      );
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  // Audio processing

  private updateAudioData() {
    const playerStatus = usePlayerStore.getState().playerStatus;

    if (playerStatus !== PlayerStatus.PLAY) {
      this.decayValues();
      return;
    }

    this.player.getAnalyzerTimeDomain(this.timeDomainArray);
    this.player.getAnalyserFrequency(this.frequencyArray);

    this.calculateFrequencyData();
    this.calculateRmsLevel();
    this.calculateFrequencyBands();
  }

  private calculateFrequencyData() {
    // Matemática Logarítmica e Interpolação
    const maxRawIndex = this.frequencyArray.length - 1;

    for (let i = 0; i < this.numPoints; i++) {
      const position = i / (this.numPoints - 1);
      const rawIndexFloat = Math.pow(maxRawIndex, position);
      const value =
        getInterpolatedValue(this.frequencyArray, rawIndexFloat) / 255;

      const frequencyEnv = followEnvelope(
        this.audioData.frequencyData[i],
        value,
        0.8,
        0.9,
      );
      this.audioData.frequencyData[i] = frequencyEnv;
    }
  }

  /**
   * Calcula o nível RMS do áudio
   */
  private calculateRmsLevel() {
    const smoothingFactor = 0.85;
    const previousRms = this.audioData.rmsLevel;
    const rawRms = getRMS(this.timeDomainArray, (value) => value / 128 - 1);
    const target = Math.sqrt(rawRms);
    this.audioData.rmsLevel =
      previousRms + (target - previousRms) * smoothingFactor;
  }

  /**
   * Calcula os níveis de graves, médios e agudos
   */
  private calculateFrequencyBands() {
    const idx = this.frequencyIndices;
    const bassBins = this.frequencyArray.subarray(idx.min, idx.bass);
    const midsBins = this.frequencyArray.subarray(idx.bass, idx.mids);
    const trebleBins = this.frequencyArray.subarray(idx.mids, idx.max);

    const previousBass = this.audioData.bass;
    const previousMids = this.audioData.mids;
    const previousTrebles = this.audioData.trebles;

    const normalization = (value: number) => value / 255;
    const bassRaw = getRMS(bassBins, normalization);
    const midsRaw = getRMS(midsBins, normalization);
    const trebleRaw = getRMS(trebleBins, normalization);

    this.audioData.bass = followEnvelope(previousBass, bassRaw, 0.85, 0.6);
    this.audioData.mids = followEnvelope(previousMids, midsRaw, 0.85, 0.6);
    this.audioData.trebles = followEnvelope(
      previousTrebles,
      trebleRaw,
      0.85,
      0.6,
    );
  }

  /**
   * Suavemente zera os valores calculados
   */
  private decayValues() {
    const decayFactor = 0.8;

    for (let i = 0; i < this.audioData.frequencyData.length; i++) {
      this.audioData.frequencyData[i] *= decayFactor;
    }

    this.audioData.rmsLevel *= decayFactor;
    this.audioData.bass *= decayFactor;
    this.audioData.mids *= decayFactor;
    this.audioData.trebles *= decayFactor;
  }
}

const playerInstance = getPlayer();
export const audioDispatcher = new AudioDispatcher(playerInstance);
