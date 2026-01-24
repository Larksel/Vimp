import { RefObject, useEffect, useRef } from 'react';
import { useAudioData, AudioData } from '@renderer/features/audioReaction';

type StyleMap = Record<string, string | number>;

/**
 * Hook para aplicar animações a elementos HTML com base na análise de áudio.
 * @param refs - Um array de RefObjects para os elementos a serem animados.
 * @param styleFunction - Uma função que recebe os dados de áudio e retorna um objeto de estilo CSS.
 */
export default function useAudioAnimation<
  T extends HTMLElement | SVGSVGElement,
>(refs: RefObject<T | null>[], styleFunction: (audio: AudioData) => StyleMap) {
  const audioDataRef = useAudioData();
  const styleFunctionRef = useRef(styleFunction);
  useEffect(() => {
    styleFunctionRef.current = styleFunction;
  }, [styleFunction]);

  const lastAppliedStyles = useRef<Map<T, StyleMap>>(new Map());

  const elementsRef = useRef<T[]>([]);

  useEffect(() => {
    // Atualiza a lista de elementos sempre que as refs mudarem
    elementsRef.current = refs.map((ref) => ref.current).filter(Boolean) as T[];
  }, [refs]);

  useEffect(() => {
    if (elementsRef.current.length === 0) return;

    let animationFrameId: number | null = null;

    const animationLoop = () => {
      const audioData = audioDataRef.current;

      const nextStyles = styleFunctionRef.current(audioData);

      for (const el of elementsRef.current) {
        let lastStyles = lastAppliedStyles.current.get(el);

        if (!lastStyles) {
          lastStyles = {};
          lastAppliedStyles.current.set(el, lastStyles);
        }

        for (const key in nextStyles) {
          const nextValue = nextStyles[key];

          if (lastStyles[key] !== nextValue) {
            if (key.startsWith('--')) {
              el.style.setProperty(key, String(nextValue));
            } else {
              el.style[key] = String(nextValue);
            }

            lastStyles[key] = nextValue;
          }
        }
      }

      animationFrameId = requestAnimationFrame(animationLoop);
    };

    animationLoop();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [audioDataRef]);
}
