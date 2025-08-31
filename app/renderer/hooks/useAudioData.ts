import { PlayerService } from '@renderer/features/player';
import { useEffect, useRef } from 'react';

interface AudioData {
  rmsLevel: number;
  frequencyData: Uint8Array<ArrayBuffer> | null;
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

  const calculateRmsLevel = (timeDomainDataArray: Uint8Array<ArrayBuffer>) => {
    PlayerService.getAnalyzerTimeDomain(timeDomainDataArray);
    let smoothedRMS = previousRmsRef.current;
    const smoothingFactor = 0.5;

    // Calculate RMS (Root Mean Square)
    let sumSquares = 0;
    for (const value of timeDomainDataArray) {
      const normalized = value / 128 - 1; // Normalize to [-1, 1]
      sumSquares += normalized ** 2;
    }
    const raw_rms = Math.sqrt(sumSquares / timeDomainDataArray.length);

    // Smooth the RMS value
    const target = Math.sqrt(raw_rms);
    smoothedRMS = smoothedRMS + (target - smoothedRMS) * smoothingFactor;

    previousRmsRef.current = smoothedRMS;
    audioDataRef.current.rmsLevel = smoothedRMS;

    return smoothedRMS;
  };

  const calculateFrequencyBands = (
    frequencyDataArray: Uint8Array<ArrayBuffer>,
  ) => {
    const sampleRate = PlayerService.getSampleRate();
    const fftSize = PlayerService.getAnalyzerFftSize();
    const hzPerBin = sampleRate / fftSize;

    const bassCutoff = 200;
    const midCutoff = 4000;

    const bassEndIndex = Math.floor(bassCutoff / hzPerBin);
    const midsEndIndex = Math.floor(midCutoff / hzPerBin);

    const bassBins = frequencyDataArray.slice(0, bassEndIndex);
    const midsBins = frequencyDataArray.slice(bassEndIndex, midsEndIndex);
    const trebleBins = frequencyDataArray.slice(
      midsEndIndex,
      frequencyDataArray.length,
    );

    const getRMS = (data: Uint8Array<ArrayBuffer>) => {
      if (data.length === 0) return 0;

      let sumSquares = 0;

      for (const value of data) {
        const normalized = value / 255; // Normalize to [0, 1]
        sumSquares += normalized ** 2;
      }

      const squareRoot = Math.sqrt(sumSquares / data.length);

      return Math.min(squareRoot, 1);
    };

    audioDataRef.current.bass = getRMS(bassBins);
    audioDataRef.current.mids = getRMS(midsBins);
    audioDataRef.current.trebles = getRMS(trebleBins);
  };

  const getFrequencyData = (frequencyDataArray: Uint8Array<ArrayBuffer>) => {
    PlayerService.getAnalyserFrequency(frequencyDataArray);
    audioDataRef.current.frequencyData = frequencyDataArray;
  };

  useEffect(() => {
    let animationFrameId: number;
    const bufferSize = PlayerService.getAnalyzerBufferSize();
    const timeDomainDataArray = new Uint8Array(bufferSize);
    const frequencyDataArray = new Uint8Array(bufferSize);

    const animationLoop = () => {
      calculateRmsLevel(timeDomainDataArray);
      getFrequencyData(frequencyDataArray);
      calculateFrequencyBands(frequencyDataArray);

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return audioDataRef;
}
