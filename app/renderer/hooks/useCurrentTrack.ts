import usePlayerStore from "@stores/usePlayerStore";
import { TrackModel } from "@shared/types/vimp";

/**
 * Returns the current track
 */
export default function useCurrentTrack(): TrackModel {
  return usePlayerStore((state) => {
    if (state.queue.length > 0 && state.queuePosition !== null) {
      return state.queue[state.queuePosition];
    }

    return {
      title: '',
      album: '',
      artist: [''],
      genre: [''],
      duration: 0,
      playCount: 0,
      favorite: false,
      path: '',
      cover: '',
      _id: '',
      _rev: '',
    };
  })
}