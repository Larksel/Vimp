import { CSSProperties, RefObject, useEffect, useRef } from 'react';
import { audioDispatcher } from '../audioDispatcher';
import { AudioData } from '../types';

type StyleMap = Record<string, string | number> | CSSProperties;

/**
 * Hook para aplicar animações a elementos HTML com base na análise de áudio.
 * @param refs - Um array de RefObjects para os elementos a serem animados.
 * @param styleFunction - Uma função que recebe os dados de áudio e retorna um objeto de estilo CSS.
 */
export default function useAudioAnimation<
  T extends HTMLElement | SVGSVGElement,
>(refs: RefObject<T | null>[], styleFunction: (audio: AudioData) => StyleMap) {
  const styleFunctionRef = useRef(styleFunction);
  const elementsRef = useRef<T[]>([]);

  const lastAppliedStyles = useRef<Map<T, Record<string, string | number>>>(
    new Map(),
  );

  useEffect(() => {
    styleFunctionRef.current = styleFunction;
  }, [styleFunction]);

  useEffect(() => {
    elementsRef.current = refs.map((ref) => ref.current).filter(Boolean) as T[];
  }, [refs]);

  useEffect(() => {
    const unsubscribe = audioDispatcher.subscribe((audioData, frameCount) => {
      if (elementsRef.current.length === 0) return;
      if (frameCount % 2 !== 0) return;

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
    });

    return unsubscribe;
  }, []);
}
