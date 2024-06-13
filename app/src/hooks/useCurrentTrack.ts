import usePlayerStore from "@/stores/usePlayerStore";
import { TrackModel } from "../../shared/types/vimp";


export default function useCurrentTrack(): TrackModel | null {
  return usePlayerStore((state) => {
    if (state.queue.length > 0 && state.queuePosition !== null) {
      return state.queue[state.queuePosition];
    }

    return null;
  })
}