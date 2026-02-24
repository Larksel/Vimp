import { useEffect, useRef } from 'react';
import { AudioData } from '@shared/types/vimp';
import { audioDispatcher } from '@renderer/core/audioDispatcher';

export default function useAudioData() {
  const audioDataRef = useRef<AudioData>({
    rmsLevel: 0,
    frequencyData: new Float32Array(0),
    bass: 0,
    mids: 0,
    trebles: 0,
  });
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    const unsubscribe = audioDispatcher.subscribe((data, frameCount) => {
      audioDataRef.current = data;
      frameCountRef.current = frameCount;
    });

    return unsubscribe;
  }, []);

  return { audioDataRef, frameCountRef };
}
