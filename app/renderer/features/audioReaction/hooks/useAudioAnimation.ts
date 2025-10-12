import { CSSProperties, RefObject, useEffect, useRef } from 'react';
import { useAudioData, AudioData } from '@renderer/features/audioReaction';

/**
 * Hook para aplicar animações a elementos HTML com base na análise de áudio.
 * @param refs - Um array de RefObjects para os elementos a serem animados.
 * @param styleFunction - Uma função que recebe os dados de áudio e retorna um objeto de estilo CSS.
 */
export default function useAudioAnimation<
  T extends HTMLElement | SVGSVGElement,
>(
  refs: RefObject<T | null>[],
  styleFunction: (audio: AudioData) => CSSProperties,
) {
  const audioDataRef = useAudioData();
  const styleFunctionRef = useRef(styleFunction);

  useEffect(() => {
    if (refs.length === 0) {
      return;
    }

    let animationFrameId: number;

    const animationLoop = () => {
      const audioData = audioDataRef.current;
      const calculatedStyles = styleFunctionRef.current(audioData);

      for (const ref of refs) {
        if (ref.current) {
          Object.assign(ref.current.style, calculatedStyles);
        }
      }

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      for (const ref of refs) {
        if (ref.current) {
          Object.assign(ref.current.style, {
            transform: '',
            filter: '',
          });
        }
      }
    };
  }, [audioDataRef, refs]);
}
