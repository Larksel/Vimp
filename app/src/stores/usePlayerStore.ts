import { StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

import { PlayerStatus, RepeatMode, TrackModel } from '../../shared/types/vimp';
import { createStore } from '@/lib/utils-store';
import player from '@/lib/player';

type PlayerState = {
  queue: TrackModel[];
  originalQueue: TrackModel[];
  queuePosition: number | null;
  queueOrigin: string | null;
  shuffle: boolean;
  repeat: RepeatMode;
  playerStatus: PlayerStatus;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  api: {
    start: (queue: TrackModel[], _id?: string) => Promise<void>;
    play: () => Promise<void>;
    pause: () => void;
    playPause: () => Promise<void>;
    stop: () => void;
    previous: () => Promise<void>;
    next: () => Promise<void>;
    setVolume: (volume: number) => void;
    setIsMuted: (muted?: boolean) => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
    setSongProgress: (progress: number) => void;
    setPlaybackRate: (playbackRate: number) => void;
  };
};

const usePlayerStore = createPlayerStore<PlayerState>((set, get) => ({
  queue: [],
  originalQueue: [],
  queuePosition: null,
  queueOrigin: null,
  shuffle: false,
  repeat: RepeatMode.OFF,
  playerStatus: PlayerStatus.STOP,
  volume: 67,
  isMuted: false,
  playbackRate: 1,
  api: {
    start: async (queue, _id) => {
      if (queue.length === 0) return;

      const trackID = _id || queue[0]._id;
      const queuePosition = queue.findIndex((track) => track._id === trackID);

      if (queuePosition > -1) {
        const track = queue[queuePosition];

        player.setTrack(track);
        await player.play();

        set({
          queue: queue,
          queuePosition: queuePosition,
          playerStatus: PlayerStatus.PLAY,
        });
      }
    },
    play: async () => {
      await player.play();
      set({ playerStatus: PlayerStatus.PLAY });
    },
    pause: () => {
      player.pause();
      set({ playerStatus: PlayerStatus.PAUSE });
    },
    playPause: async () => {
      const playerAPI = get().api;
      const { queue } = get();
      const { paused } = player.getAudio();

      if (paused && queue.length > 0) {
        playerAPI.play();
      } else {
        playerAPI.pause();
      }
    },
    stop: () => {
      player.stop();
      get().api.setSongProgress(0);

      set({
        queue: [],
        queuePosition: null,
        playerStatus: PlayerStatus.STOP,
      });
    },
    previous: async () => {
      const { queue, queuePosition, repeat } = get();
      const currentTime = player.getCurrentTime();

      let newPosition: number;

      if (queuePosition !== null) {
        if (currentTime > 5) {
          newPosition = queuePosition;
        } else if (queuePosition === 0 && repeat === RepeatMode.ALL) {
          newPosition = queue.length - 1;
        } else if (queuePosition !== 0) {
          newPosition = queuePosition - 1;
        } else {
          newPosition = queuePosition;
        }

        const track = queue[newPosition];

        if (track) {
          player.setTrack(track);
          await player.play();

          set({
            queuePosition: newPosition,
            playerStatus: PlayerStatus.PLAY,
          });
        } else {
          get().api.stop();
        }
      }
    },
    next: async () => {
      const { queue, queuePosition, repeat } = get();
      let newPosition: number;

      if (queuePosition !== null) {
        if (repeat === RepeatMode.ONE) {
          newPosition = queuePosition;
        } else if (
          repeat === RepeatMode.ALL &&
          queuePosition === queue.length - 1
        ) {
          newPosition = 0;
        } else {
          newPosition = queuePosition + 1;
        }

        const track = queue[newPosition];

        if (track) {
          player.setTrack(track);
          await player.play();

          set({
            playerStatus: PlayerStatus.PLAY,
            queuePosition: newPosition,
          });
        } else {
          get().api.pause();
          get().api.setSongProgress(0);
        }
      }
    },
    setVolume: (volume) => {
      player.setVolume(volume);
      set({ volume: volume });
    },
    setIsMuted: async (muted = false) => {
      if (muted) {
        player.mute();
      } else {
        player.unmute();
      }
      set({ isMuted: muted });
    },
    toggleShuffle: async () => {
      const { shuffle } = get();

      //TODO implementar lógica do shuffle
      set({ shuffle: !shuffle });
    },
    toggleRepeat: async () => {
      const { repeat } = get();
      switch (repeat) {
        case RepeatMode.OFF: {
          set({ repeat: RepeatMode.ALL });
          break;
        }
        case RepeatMode.ALL: {
          set({ repeat: RepeatMode.ONE });
          break;
        }
        case RepeatMode.ONE: {
          set({ repeat: RepeatMode.OFF });
          break;
        }
        default:
          break;
      }
    },
    setSongProgress: (progress) => {
      player.setCurrentTime(progress);
    },
    setPlaybackRate: (playbackRate) => {
      if (playbackRate >= 0.5 && playbackRate <= 5) {
        player.setPlaybackRate(playbackRate);
      }
    },
  },
}));

export default usePlayerStore;

export function usePlayerAPI() {
  return usePlayerStore((state) => state.api);
}

function createPlayerStore<T extends PlayerState>(store: StateCreator<T>) {
  return createStore(store);
}
