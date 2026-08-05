import usePlayerStore, { usePlayerAPI } from '@renderer/stores/usePlayerStore';
import TrackList from '@renderer/components/TrackList';

export default function QueueView() {
  const playerAPI = usePlayerAPI();
  const queue = usePlayerStore((state) => state.queue);

  const handleItemClick = (id: number) => {
    if (queue.length > 0) {
      playerAPI.playTrackById(id);
    } else {
      playerAPI.startPlayback(queue, id);
    }
  };

  const handleItemMove = (from: number, to: number) => {
    playerAPI.moveTrack(from, to);
  };

  return (
    <div>
      <TrackList
        items={queue}
        onItemClick={handleItemClick}
        onItemMove={handleItemMove}
      />
    </div>
  );
}
