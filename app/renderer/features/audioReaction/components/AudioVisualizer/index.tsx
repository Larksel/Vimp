import { useAudioData } from '@renderer/features/audioReaction';
import { betweenMinMax } from '@renderer/utils/utils';
import { useCallback, useEffect, useRef } from 'react';

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
  const audioDataRef = useAudioData();
  const style = getComputedStyle(document.documentElement);
  const accentColor = style.getPropertyValue('--color-accent').trim();
  waveScale = betweenMinMax(waveScale, 0.5, 3);
  waveColor = waveColor ?? (accentColor === '' ? '#FFF' : accentColor);
  glowColor = glowColor ?? waveColor;

  const drawWaveform = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      data: number[],
      width: number,
      height: number,
      color: string,
    ) => {
      const step = width / (data.length - 1);
      const centerY = height / 2;

      ctx.beginPath();

      // Começa no primeiro ponto da curva superior
      ctx.moveTo(0, centerY - data[0]);

      // Curva superior (esquerda → direita)
      for (let i = 0; i < data.length - 1; i++) {
        const x1 = i * step;
        const x2 = (i + 1) * step;
        const y1 = centerY - data[i] * centerY;
        const y2 = centerY - data[i + 1] * centerY;
        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      // Último ponto superior
      ctx.lineTo(width, centerY - data[data.length - 1]);

      // Curva inferior (direita ← esquerda)
      for (let i = data.length - 1; i > 0; i--) {
        const x1 = i * step;
        const x2 = (i - 1) * step;
        const y1 = centerY + data[i] * centerY;
        const y2 = centerY + data[i - 1] * centerY;
        const xc = (x1 + x2) / 2;
        const yc = (y1 + y2) / 2;
        ctx.quadraticCurveTo(x1, y1, xc, yc);
      }

      // Último ponto inferior
      ctx.lineTo(0, centerY + data[0]);

      // Fechar caminho e preencher
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowBlur = glowSize;
      ctx.shadowColor = `${glowColor}`;
      ctx.fill();
    },
    [glowColor, glowSize],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const animate = () => {
      const frequencyData = audioDataRef.current.frequencyData;

      if (!frequencyData) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const smoothedData = frequencyData.map((val, i, arr) => {
        const prev = arr[i - 1] ?? val;
        const next = arr[i + 1] ?? val;
        return (prev + val + next) / 3;
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWaveform(ctx, smoothedData, canvas.width, canvas.height, waveColor);

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [audioDataRef, drawWaveform, waveColor, waveScale]);

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
