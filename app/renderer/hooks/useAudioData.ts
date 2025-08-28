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

  useEffect(() => {
    let animationFrameId: number;
    const bufferSize = PlayerService.getAnalyzerBufferSize();
    const dataArray = new Uint8Array(bufferSize);

    let smoothedRMS = 0;
    const smoothingFactor = 0.5;

    const animationLoop = () => {
      PlayerService.getAnalyzerTimeDomain(dataArray);

      // Calculate RMS (Root Mean Square)
      let sumSquares = 0;
      for (let i = 0; i < bufferSize; i++) {
        const normalized = dataArray[i] / 128 - 1; // Normalize to [-1, 1]
        sumSquares += normalized ** 2;
      }
      const raw_rms = Math.sqrt(sumSquares / bufferSize);

      // Smooth the RMS value
      const target = Math.sqrt(raw_rms);
      smoothedRMS = smoothedRMS + (target - smoothedRMS) * smoothingFactor;

      audioDataRef.current.rmsLevel = smoothedRMS;

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return audioDataRef;
}
