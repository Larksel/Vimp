import { PlayerService } from '@renderer/features/player';
import usePlayerStore from '@renderer/stores/usePlayerStore';
import { PlayerStatus } from '@shared/types/vimp';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export interface AudioData {
  rmsLevel: number;
  frequencyData: number[] | null;
  bass: number;
  mids: number;
  trebles: number;
}

export default function useAudioData() {
  const audioDataRef = useRef<AudioData>({
    rmsLevel: 0,
    frequencyData: null,
    bass: 0,
    mids: 0,
    trebles: 0,
  });
  const previousRmsRef = useRef(0);
  const playerStatus = usePlayerStore((state) => state.playerStatus);
  const isPlaying = playerStatus === PlayerStatus.PLAY;

  // Linha de corte das frequências (Hz)
  const minFrequency = 40;
  const bassCutoff = 250;
  const midCutoff = 4000;
  const maxFrequency = 16000;

  // Helpers
  function getFrequencyEndIndex(frequency: number) {
    const sampleRate = PlayerService.getSampleRate();
    const fftSize = PlayerService.getAnalyzerFftSize();
    const hzPerBin = sampleRate / fftSize;

    return Math.floor(frequency / hzPerBin);
  }

  function getInterpolatedValue(data: Uint8Array, index: number): number {
    const floorIndex = Math.floor(index);
    const ceilIndex = Math.ceil(index);
    const fraction = index - floorIndex;

    // Garante que não tentaremos ler fora do array
    if (ceilIndex >= data.length) {
      return data[floorIndex] ?? 0;
    }

    const valueLow = data[floorIndex];
    const valueHigh = data[ceilIndex];

    // Fórmula da interpolação linear:
    // Valor = ValorBase + (Diferença * Fração)
    return valueLow + (valueHigh - valueLow) * fraction;
  }

  function getRMS(
    data: Uint8Array<ArrayBuffer>,
    normalizationFunc?: (value: number) => number,
  ) {
    if (data.length === 0) return 0;

    let sumSquares = 0;
    for (const value of data) {
      const normalized = normalizationFunc ? normalizationFunc(value) : value;
      sumSquares += normalized ** 2;
    }

    const squareRoot = Math.sqrt(sumSquares / data.length);

    return Math.min(squareRoot, 1);
  }

  function decayValues() {
    const decayFactor = 0.85;
    const frequencyData = audioDataRef.current.frequencyData;

    if (frequencyData) {
      // Zera os valores suavemente
      for (let i = 0; i < frequencyData.length; i++) {
        frequencyData[i] *= decayFactor;
      }

      const decayedFrequencyDataArray = Array.from(frequencyData);
      audioDataRef.current.frequencyData = decayedFrequencyDataArray;
    }

    audioDataRef.current.rmsLevel *= decayFactor;
    audioDataRef.current.bass *= decayFactor;
    audioDataRef.current.mids *= decayFactor;
    audioDataRef.current.trebles *= decayFactor;
  }

  // Arrays para armazenar os dados do analyser
  const dataArraySize = getFrequencyEndIndex(maxFrequency);
  const frequencyDataArrayRef = useRef(new Uint8Array(dataArraySize));
  const timeDomainDataArrayRef = useRef(new Uint8Array(dataArraySize));

  const calculateRmsLevel = useCallback(
    (timeDomainDataArray: Uint8Array<ArrayBuffer>) => {
      let smoothedRMS = previousRmsRef.current;
      const smoothingFactor = 0.5;

      const raw_rms = getRMS(timeDomainDataArray, (value) => value / 128 - 1);

      // Smooth the RMS value
      const target = Math.sqrt(raw_rms);
      smoothedRMS = smoothedRMS + (target - smoothedRMS) * smoothingFactor;

      previousRmsRef.current = smoothedRMS;
      audioDataRef.current.rmsLevel = smoothedRMS;

      return smoothedRMS;
    },
    [],
  );

  const calculateFrequencyBands = useCallback(
    (frequencyDataArray: Uint8Array<ArrayBuffer>) => {
      const minFrequencyEndIndex = getFrequencyEndIndex(minFrequency);
      const bassEndIndex = getFrequencyEndIndex(bassCutoff);
      const midsEndIndex = getFrequencyEndIndex(midCutoff);
      const maxFrequencyEndIndex = getFrequencyEndIndex(maxFrequency);

      const bassBins = frequencyDataArray.slice(
        minFrequencyEndIndex,
        bassEndIndex,
      );
      const midsBins = frequencyDataArray.slice(bassEndIndex, midsEndIndex);
      const trebleBins = frequencyDataArray.slice(
        midsEndIndex,
        maxFrequencyEndIndex,
      );

      const normalization = (value: number) => value / 255;
      audioDataRef.current.bass = getRMS(bassBins, normalization);
      audioDataRef.current.mids = getRMS(midsBins, normalization);
      audioDataRef.current.trebles = getRMS(trebleBins, normalization);
    },
    [],
  );

  const numPoints = 180;
  const logData = useMemo(() => new Float32Array(numPoints), []);

  useEffect(() => {
    let animationFrameId: number | null = null;

    const animationLoop = () => {
      if (isPlaying) {
        PlayerService.getAnalyzerTimeDomain(timeDomainDataArrayRef.current);
        PlayerService.getAnalyserFrequency(frequencyDataArrayRef.current);

        const rawData = frequencyDataArrayRef.current;
        const maxRawIndex = rawData.length - 1;

        for (let i = 0; i < numPoints; i++) {
          const position = i / (numPoints - 1);
          const rawIndexFloat = 1 * Math.pow(maxRawIndex / 1, position);
          const value = getInterpolatedValue(rawData, rawIndexFloat) / 255;

          // Equalização visual dos valores
          // const weight = Math.min(1, 0.5 + i / numPoints);
          // value *= weight;

          logData[i] = value;
        }

        audioDataRef.current.frequencyData = logData as unknown as number[];

        calculateRmsLevel(timeDomainDataArrayRef.current);
        calculateFrequencyBands(frequencyDataArrayRef.current);
      } else {
        decayValues();
      }

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [calculateFrequencyBands, calculateRmsLevel, isPlaying, logData]);

  return audioDataRef;
}
