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
  songDuration: number;
  songProgress: number;
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
    toggleMuted: () => void;
    setSongDuration: (duration: number) => void;
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
  songDuration: 0,
  songProgress: 0,
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
        if (currentTime < 5) {
          newPosition = queuePosition - 1;
        } else {
          newPosition = queuePosition;
        }

        //TODO selecionar última track da fila quando
        //TODO RepeatMode.ALL e queuePosition == 0

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
          get().api.stop();
        }
      }
    },
    setVolume: (volume) => {
      player.setVolume(volume);
      set({ volume: volume });
    },
    toggleMuted: async () => {
      const { isMuted } = get();
      if (isMuted) {
        player.unmute();
        set({ isMuted: false });
      } else {
        player.mute();
        set({ isMuted: true });
      }
    },
    setSongDuration: (duration) => {
      set({ songDuration: duration });
    },
    setSongProgress: (progress) => {
      set({ songProgress: progress });
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
  return createStore(
    persist(store, {
      name: 'vimp-player',
      onRehydrateStorage: () => {
        console.log('Player store is being hydrated');
        return (state, error) => {
          if (error || state == null) {
            console.log('Error on hydration', error);
          } else {
            const { queue, queuePosition } = state;
            if (queue && queuePosition) {
              const track = queue[queuePosition];
              player.setTrack(track);
            }
          }
        };
      },
      merge(persistedState, currentState) {
        if (persistedState == null) {
          persistedState = {
            playerStatus: PlayerStatus.STOP,
          };
        }

        return {
          ...currentState,
          ...(persistedState as Partial<PlayerState>),
          api: currentState.api,
          playerStatus:
            (persistedState as PlayerState).playerStatus === PlayerStatus.PLAY
              ? PlayerStatus.PAUSE
              : (persistedState as PlayerState).playerStatus,
        };
      },
    }),
  );
}
