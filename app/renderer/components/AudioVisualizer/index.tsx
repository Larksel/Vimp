import player from '@features/player';
import { useEffect, useRef } from 'react';

export default function AudioVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audio = player.getAudio();
  const style = getComputedStyle(document.documentElement);
  const barColor = style.getPropertyValue('--color-accent').trim();

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !audio) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferSize = player.getBufferSize() * 0.63;
    const dataArray = new Uint8Array(bufferSize);
    const barWidth = canvas.width / bufferSize;

    const animate = () => {
      let x = 0;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      player.getAnalyserData(dataArray);

      for (let i = 0; i < bufferSize; i++) {
        const barHeight = dataArray[i];
        ctx.fillStyle = barColor;
        ctx.fillRect(
          x,
          canvas.height / 1.25 - barHeight,
          barWidth+1,
          barHeight * 2 + 0.5,
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
