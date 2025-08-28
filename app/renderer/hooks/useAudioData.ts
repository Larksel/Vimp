import { PlayerService } from '@renderer/features/player';
import { useEffect, useRef } from 'react';

export default function useAudioData() {
  const audioDataRef = useRef({
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

  useEffect(() => {
    let animationFrameId: number;
    const bufferSize = PlayerService.getAnalyzerBufferSize();
    const timeDomainDataArray = new Uint8Array(bufferSize);
    // const frequencyDataArray = new Uint8Array(bufferSize);

    const animationLoop = () => {
      calculateRmsLevel(timeDomainDataArray);

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return audioDataRef;
}
