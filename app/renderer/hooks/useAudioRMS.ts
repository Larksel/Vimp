import { PlayerService } from '@renderer/features/player';
import { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import { useEffect, useRef } from 'react';

export default function useAudioRMS() {
  const animationFrameId = useRef<number>(null);
  const playerAPI = usePlayerAPI();

  useEffect(() => {
    const bufferSize = PlayerService.getAnalyzerBufferSize();
    const dataArray = new Uint8Array(bufferSize);

    let smoothedRMS = 0;
    const smoothingFactor = 0.4;

    const animate = () => {
      PlayerService.getAnalyzerTimeDomain(dataArray);

      let sum = 0;

      for (let i = 0; i < bufferSize; i++) {
        const normalized = dataArray[i] / 128 - 1; // Normalize to [-1, 1]
        sum += normalized ** 2;
      }

      const raw_rms = Math.sqrt(sum / bufferSize);
      const target = Math.sqrt(raw_rms); // Opcional, melhora a percepção visual

      smoothedRMS = smoothedRMS + (target - smoothedRMS) * smoothingFactor;

      playerAPI.setRmsLevel(smoothedRMS);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [playerAPI]);
}
