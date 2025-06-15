import player from '@features/player';
import { useEffect, useRef } from 'react';

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audio = player.getAudio();
  const style = getComputedStyle(document.documentElement);
  const barColor = style.getPropertyValue('--color-accent').trim();

  function smoothData(data: Uint8Array, windowSize = 5): Uint8Array {
    const smoothed = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (
        let j = -Math.floor(windowSize / 2);
        j <= Math.floor(windowSize / 2);
        j++
      ) {
        if (data[i + j] !== undefined) {
          sum += data[i + j];
          count++;
        }
      }
      smoothed[i] = sum / count;
    }
    return smoothed;
  }

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferSize = player.getBufferSize() * 0.63;
    const barWidth = canvas.width / bufferSize;

    const animate = () => {
      let x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rawData = new Uint8Array(bufferSize);
      player.getAnalyserData(rawData);
      const dataArray = smoothData(rawData, 5);

      for (let i = 0; i < bufferSize; i++) {
        const barHeight = dataArray[i] * 2;
        ctx.fillStyle = barColor;
        ctx.fillRect(
          x,
          canvas.height / 2 - barHeight,
          barWidth + 1,
          barHeight * 2,
        );
        x += barWidth;
      }

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
