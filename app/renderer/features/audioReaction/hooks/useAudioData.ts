import { useEffect, useRef } from 'react';
import { AudioData } from '../types';
import { audioDispatcher } from '../audioDispatcher';

export default function useAudioData() {
  const audioDataRef = useRef<AudioData>({
    rmsLevel: 0,
    frequencyData: new Float32Array(0),
    bass: 0,
    mids: 0,
    trebles: 0,
  });

  useEffect(() => {
    const unsubscribe = audioDispatcher.subscribe((data) => {
      audioDataRef.current = data;
    });

    return unsubscribe;
  }, []);

  return audioDataRef;
}
