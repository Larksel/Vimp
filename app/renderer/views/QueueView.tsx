import usePlayerStore, { usePlayerAPI } from '@stores/usePlayerStore';
import TrackList from '@components/TrackList/TrackList';

export default function QueueView() {
  const playerAPI = usePlayerAPI();
  const queue = usePlayerStore((state) => state.queue);

  const handleItemClick = (trackID: string) => {
    if (queue.length > 0) {
      playerAPI.jumpToTrack(trackID);
    } else {
      playerAPI.start(queue, trackID);
    }
  }

  return (
    <div>
      <TrackList queue={queue} onItemClick={handleItemClick} />
    </div>
  )
}
