import { audioDispatcher } from '../audioDispatcher';
import { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  waveColor?: string | null;
  waveScale?: number;
  glowColor?: string | null;
  glowSize?: number;
}

export default function AudioVisualizer({
  waveScale = 1,
  waveColor,
  glowColor,
  glowSize = 30,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorsRef = useRef({ wave: '#FFF', glow: '#FFF' });
  const data = useRef(new Float32Array(audioDispatcher.numPoints));

  useEffect(() => {
    const style = getComputedStyle(document.documentElement);
    const accentColor = style.getPropertyValue('--color-accent').trim();
    const finalWaveColor =
      waveColor ?? (accentColor === '' ? '#FFF' : accentColor);

    colorsRef.current = {
      wave: finalWaveColor,
      glow: glowColor ?? finalWaveColor,
    };
  }, [waveColor, glowColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const unsubscribe = audioDispatcher.subscribe((audioData) => {
      const rawData = audioData.frequencyData;

      for (let i = 0; i < rawData.length; i++) {
        const curr = rawData[i];
        const prev = rawData[i - 1] ?? curr;
        const next = rawData[i + 1] ?? curr;
        data[i] = (prev + curr + next) / 3;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;
      const step = width / (data.current.length - 1);

      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.strokeStyle = colorsRef.current.wave;
      ctx.lineWidth = 2;

      // Aplica brilho se necessário
      if (glowSize > 0) {
        ctx.shadowBlur = glowSize;
        ctx.shadowColor = colorsRef.current.glow;
      }

      // Curva superior (esquerda → direita)
      ctx.moveTo(0, centerY);
      for (let i = 0; i < data.current.length - 1; i++) {
        const x1 = i * step;
        const x2 = (i + 1) * step;
        const y1 = centerY - data[i] * centerY * waveScale;
        const y2 = centerY - data[i + 1] * centerY * waveScale;

        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      // Curva inferior (direita ← esquerda)
      for (let i = data.current.length - 1; i > 0; i--) {
        const x1 = i * step;
        const x2 = (i - 1) * step;
        const y1 = centerY + data[i] * centerY * waveScale;
        const y2 = centerY + data[i - 1] * centerY * waveScale;

        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      ctx.fillStyle = colorsRef.current.wave;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    return unsubscribe;
  }, [waveScale, glowSize]);

  return (
    <div className='z-10 flex h-full w-full items-center justify-center bg-transparent'>
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className='h-full w-full rounded-lg'
      />
    </div>
  );
}
