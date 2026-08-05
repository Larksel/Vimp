import usePlayerStore from '@renderer/stores/usePlayerStore';
import { AudioItem } from '@shared/types/entities';

export default function useCurrentTrack(): AudioItem | null {
  return usePlayerStore((state) => {
    if (state.queue.length > 0 && state.queuePosition !== null) {
      return state.queue[state.queuePosition];
    }
    return null;
  });
}
