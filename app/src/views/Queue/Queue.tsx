import usePlayerStore from '@/stores/usePlayerStore';

import TrackList from '@/componentes/TrackList/TrackList';

export default function Queue() {
  const queue = usePlayerStore((state) => state.queue);
  const queuePosition = usePlayerStore((state) => state.queuePosition);

  return (
    <div>
      <TrackList queue={queue} queuePosition={queuePosition} />
    </div>
  )
}
