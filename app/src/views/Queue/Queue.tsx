import usePlayerStore, { usePlayerAPI } from '@/stores/usePlayerStore';

export default function Queue() {
  const playerAPI = usePlayerAPI();
  const queue = usePlayerStore((state) => state.queue);
  const queuePosition = usePlayerStore((state) => state.queuePosition);

  if (queue.length > 0) {
    return (
      <div>
        {queue.map((track, index) => (
          <div
            key={`${index}-track-${track.title}`}
            className={`${queuePosition === index ? 'font-bold text-green-500' : ''}`}
          >
            {track.title}
          </div>
        ))}
      </div>
    );
  } else {
    return <div>Fila vazia</div>;
  }
}
