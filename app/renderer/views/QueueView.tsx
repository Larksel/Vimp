import usePlayerStore, { usePlayerAPI } from '@stores/usePlayerStore';
import TrackList from '@components/TrackList';

export default function QueueView() {
  const playerAPI = usePlayerAPI();
  const queue = usePlayerStore((state) => state.queue);

  const handleItemClick = (trackID: string) => {
    if (queue.length > 0) {
      playerAPI.playTrackById(trackID);
    } else {
      playerAPI.startPlayback(queue, trackID);
    }
  };

  return (
    <div>
      <TrackList queue={queue} onItemClick={handleItemClick} />
    </div>
  );
}
