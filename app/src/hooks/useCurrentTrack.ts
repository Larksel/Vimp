import usePlayerStore from "@/stores/usePlayerStore";
import { Track, TrackModel } from "../../shared/types/vimp";

export default function useCurrentTrack(): TrackModel | Track {
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
      lastPlayed: null,
      path: '',
      cover: '',
    };
  })
}