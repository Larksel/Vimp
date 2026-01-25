import { PlayerService } from '@renderer/features/player';
import { AudioData } from './types';
import usePlayerStore from '@renderer/stores/usePlayerStore';
import { PlayerStatus } from '@shared/types/vimp';

type AudioListener = (data: AudioData) => void;

/**
 * Gerencia os listeners e os notifica com os dados de áudio em tempo real.
 */
class AudioDispatcher {
  private listeners = new Set<AudioListener>();
  private animationFrameId: number | null = null;
  public isRunning = false;

  // Linha de corte das frequências (Hz)
  private minFrequency = 40;
  private bassCutoff = 150;
  private midCutoff = 4000;
  private maxFrequency = 16000;

  private bassEnv = 0;
  private midsEnv = 0;
  private trebleEnv = 0;

  public numPoints = 240;
  private dataArraySize = this.getFrequencyEndIndex(this.maxFrequency);
  private frequencyArray = new Uint8Array(this.dataArraySize);
  private timeDomainArray = new Uint8Array(this.dataArraySize);
  private previousRms = 0;

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
    if (!this.isRunning) this.start();
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0) this.stop();
    };
  }

  private start() {
    this.isRunning = true;
    this.loop();
  }

  private stop() {
    this.isRunning = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
  }

  private loop = () => {
    if (!this.isRunning) return;

    this.updateAudioData();
    this.listeners.forEach((listener) => listener(this.audioData));

    this.animationFrameId = requestAnimationFrame(this.loop);
  };

  // Audio processing

  private updateAudioData() {
    const playerStatus = usePlayerStore.getState().playerStatus;
    const isPlaying = playerStatus === PlayerStatus.PLAY;

    if (!isPlaying) {
      this.decayValues();
      return;
    }

    PlayerService.getAnalyzerTimeDomain(this.timeDomainArray);
    PlayerService.getAnalyserFrequency(this.frequencyArray);

    this.calculateFrequencyData();
    this.calculateRmsLevel();
    this.calculateFrequencyBands();
  }

  private calculateFrequencyData() {
    // Matemática Logarítmica e Interpolação
    const maxRawIndex = this.frequencyArray.length - 1;

    for (let i = 0; i < this.numPoints; i++) {
      const position = i / (this.numPoints - 1);
      const rawIndexFloat = 1 * Math.pow(maxRawIndex / 1, position);
      const value =
        this.getInterpolatedValue(this.frequencyArray, rawIndexFloat) / 255;

      this.audioData.frequencyData[i] = value;
    }
  }

  /**
   * Calcula o nível RMS do áudio
   */
  private calculateRmsLevel() {
    const smoothingFactor = 0.5;
    const rawRms = this.getRMS(
      this.timeDomainArray,
      (value) => value / 128 - 1,
    );
    const target = Math.sqrt(rawRms);
    this.previousRms =
      this.previousRms + (target - this.previousRms) * smoothingFactor;
    this.audioData.rmsLevel = this.previousRms;
  }

  /**
   * Calcula os níveis de graves, médios e agudos
   */
  private calculateFrequencyBands() {
    const minFrequencyEndIndex = this.getFrequencyEndIndex(this.minFrequency);
    const bassEndIndex = this.getFrequencyEndIndex(this.bassCutoff);
    const midsEndIndex = this.getFrequencyEndIndex(this.midCutoff);
    const maxFrequencyEndIndex = this.getFrequencyEndIndex(this.maxFrequency);

    const bassBins = this.frequencyArray.slice(
      minFrequencyEndIndex,
      bassEndIndex,
    );
    const midsBins = this.frequencyArray.slice(bassEndIndex, midsEndIndex);
    const trebleBins = this.frequencyArray.slice(
      midsEndIndex,
      maxFrequencyEndIndex,
    );

    const normalization = (value: number) => value / 255;
    const bassRaw = this.getRMS(bassBins, normalization);
    const midsRaw = this.getRMS(midsBins, normalization);
    const trebleRaw = this.getRMS(trebleBins, normalization);

    this.bassEnv = this.followEnvelope(this.bassEnv, bassRaw);
    this.midsEnv = this.followEnvelope(this.midsEnv, midsRaw);
    this.trebleEnv = this.followEnvelope(this.trebleEnv, trebleRaw);

    this.audioData.bass = this.bassEnv;
    this.audioData.mids = this.midsEnv;
    this.audioData.trebles = this.trebleEnv;
  }

  /**
   * Suavemente zera os valores calculados
   */
  private decayValues() {
    const decayFactor = 0.85;

    for (let i = 0; i < this.audioData.frequencyData.length; i++) {
      this.audioData.frequencyData[i] *= decayFactor;
    }

    this.audioData.rmsLevel *= decayFactor;
    this.audioData.bass *= decayFactor;
    this.audioData.mids *= decayFactor;
    this.audioData.trebles *= decayFactor;
  }

  /**
   * Suaviza o ataque e a liberação das batidas dos graves, médios e agudos
   */
  private followEnvelope(
    current: number,
    target: number,
    attack = 0.6,
    release = 0.08,
  ) {
    const coeff = target > current ? attack : release;
    return current + (target - current) * coeff;
  }

  // Helpers

  private getRMS(
    data: Uint8Array,
    normalizationFunc?: (value: number) => number,
  ): number {
    if (data.length === 0) return 0;

    let sumSquares = 0;
    for (const value of data) {
      const normalized = normalizationFunc ? normalizationFunc(value) : value;
      sumSquares += normalized ** 2;
    }

    const squareRoot = Math.sqrt(sumSquares / data.length);
    return Math.min(squareRoot, 1);
  }

  /**
   * Gera pontos adicionais e suaviza as curvas
   */
  private getInterpolatedValue(data: Uint8Array, targetIndex: number): number {
    // Índice base inteiro e posição fracionária entre bins
    const baseIndex = Math.floor(targetIndex);
    const fraction = targetIndex - baseIndex;

    // Índices dos pontos de controle
    const previousIndex = Math.max(baseIndex - 1, 0);
    const currentIndex = baseIndex;
    const nextIndex = Math.min(baseIndex + 1, data.length - 1);
    const nextNextIndex = Math.min(baseIndex + 2, data.length - 1);

    // Valores dos pontos de controle
    const previousValue = data[previousIndex] ?? 0;
    const currentValue = data[currentIndex] ?? 0;
    const nextValue = data[nextIndex] ?? 0;
    const nextNextValue = data[nextNextIndex] ?? 0;

    // Potências da fração (otimiza leitura da fórmula)
    const fractionSquared = fraction * fraction;
    const fractionCubed = fractionSquared * fraction;

    // Interpolação spline cúbica (Catmull-Rom)
    return (
      0.5 *
      (2 * currentValue +
        (nextValue - previousValue) * fraction +
        (2 * previousValue - 5 * currentValue + 4 * nextValue - nextNextValue) *
          fractionSquared +
        (-previousValue + 3 * currentValue - 3 * nextValue + nextNextValue) *
          fractionCubed)
    );
  }

  private getFrequencyEndIndex(frequency: number) {
    const sampleRate = PlayerService.getSampleRate();
    const fftSize = PlayerService.getAnalyzerFftSize();
    const hzPerBin = sampleRate / fftSize;

    return Math.floor(frequency / hzPerBin);
  }
}

export const audioDispatcher = new AudioDispatcher();
