import player from '@features/player';
import { useEffect, useRef } from 'react';

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audio = player.getAudio();
  const style = getComputedStyle(document.documentElement);
  const barColor = style.getPropertyValue('--color-accent').trim();

  function groupFrequencies(
    data: Uint8Array,
    groupCount: number,
    scaleFactor = 1,
  ): number[] {
    const groupSize = Math.floor(data.length / groupCount);
    const grouped: number[] = [];

    for (let i = 0; i < groupCount; i++) {
      const start = i * groupSize;
      const end = start + groupSize;
      const slice = data.slice(start, end);

      const avg =
        slice.reduce((sum, val) => sum + val, 0) / (slice.length || 1);
      grouped.push(avg * scaleFactor);
    }

    return grouped;
  }

  function drawWaveform(
    ctx: CanvasRenderingContext2D,
    data: number[],
    width: number,
    height: number,
    color: string,
  ) {
    const step = width / (data.length - 1);
    const centerY = height / 2;

    ctx.beginPath();

    // Começa no primeiro ponto da curva superior
    ctx.moveTo(0, centerY - data[0]);

    // Curva superior (esquerda → direita)
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = i * step;
      const x2 = (i + 1) * step;
      const y1 = centerY - data[i];
      const y2 = centerY - data[i + 1];
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
      const y1 = centerY + data[i];
      const y2 = centerY + data[i - 1];
      const xc = (x1 + x2) / 2;
      const yc = (y1 + y2) / 2;
      ctx.quadraticCurveTo(x1, y1, xc, yc);
    }

    // Último ponto inferior
    ctx.lineTo(0, centerY + data[0]);

    // Fechar caminho e preencher
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /**
     * Controla o quanto do espectro da música é representado
     * * Máximo: 0.63, valores acima disso pegam frequências silenciosas
     * * Mínimo: 0.7, abrange partes mais graves
     * * Esse valor é inversamente proporcional ao fator de escalamento das ondas para que haja equilíbrio
     */
    const bufferSize = player.getBufferSize() * 0.14;
    const dataArray = new Uint8Array(bufferSize);

    // TODO Tornar valores personalizaveis
    // TODO - Escala das ondas (1 - 3), incremento: 0.5, padrão: 2
    // TODO - Grupos de frequência (32 - 128), incremento: 32, padrão: 128
    // TODO - Tamanho do buffer (0.07 - 0.63), incremento: 0.07, padrão: 0.14
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player.getAnalyserData(dataArray);
      const grouped = groupFrequencies(dataArray, 128, 2.5);

      drawWaveform(ctx, grouped, canvas.width, canvas.height, barColor);

      requestAnimationFrame(animate);
    };

    animate();
  }, [audio, barColor]);

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
