import { AudioItem } from '@shared/types/entities';

export const QueueUtils = {
  shuffleTracks: (tracks: AudioItem[], index: number): AudioItem[] => {
    const shuffledTracks = [...tracks];
    // Take the current track so we can return it to the first position
    const currentTrack = shuffledTracks.splice(index, 1)[0];

    // Shuffle
    for (let i = shuffledTracks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledTracks[i], shuffledTracks[j]] = [
        shuffledTracks[j],
        shuffledTracks[i],
      ];
    }

    // Mantain the current track on the first position
    shuffledTracks.unshift(currentTrack);
    return shuffledTracks;
  },
  filterDuplicateTracks: (
    existingQueue: AudioItem[],
    newTracks: AudioItem | AudioItem[],
  ): AudioItem[] => {
    const tracksArray = Array.isArray(newTracks) ? newTracks : [newTracks];
    return tracksArray.filter(
      (track) => !existingQueue.some((qTrack) => qTrack.id === track.id),
    );
  },
};
