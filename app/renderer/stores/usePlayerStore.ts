import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';
import debounce from 'lodash/debounce';

import { PlayerStatus, RepeatMode, TrackModel } from '@shared/types/vimp';
import { createStore } from '@render-utils/utils-store';
import player from '@features/player';

interface PlayerState {
  queue: TrackModel[];
  originalQueue: TrackModel[];
  queuePosition: number | null;
  shuffle: boolean;
  repeat: RepeatMode;
  playerStatus: PlayerStatus;
  isMuted: boolean;
  gaplessPlayback: boolean;
  crossfadeDuration: number;
  api: {
    start: (queue: TrackModel[], _id?: string) => Promise<void>;
    play: () => Promise<void>;
    pause: () => void;
    playPause: () => Promise<void>;
    stop: () => void;
    previous: () => Promise<void>;
    next: () => Promise<void>;
    addToQueue: (tracks: TrackModel | TrackModel[]) => void;
    playNext: (tracks: TrackModel | TrackModel[]) => void;
    removeFromQueue: (tracks: string | string[]) => Promise<void>;
    jumpToTrack: (_id: string) => Promise<void>;
    setVolume: (volume: number) => void;
    setIsMuted: (muted?: boolean) => void;
    toggleFavorite: (_id: string) => Promise<void>;
    toggleShuffle: () => Promise<void>;
    toggleRepeat: () => Promise<void>;
    setSongProgress: (progress: number) => void;
    setPlaybackRate: (playbackRate: number) => void;
    updateQueue: (tracks: TrackModel[]) => void;
  };
}

const { config } = window.VimpAPI;

const usePlayerStore = createPlayerStore<PlayerState>((set, get) => ({
  queue: [],
  originalQueue: [],
  queuePosition: null,
  shuffle: config.__initialConfig['audioShuffle'],
  repeat: config.__initialConfig['audioRepeatMode'],
  playerStatus: PlayerStatus.STOP,
  isMuted: config.__initialConfig['audioMuted'],
  gaplessPlayback: config.__initialConfig['audioGaplessPlayback'],
  crossfadeDuration: config.__initialConfig['audioCrossfadeDuration'],
  api: {
    start: async (queue, _id) => {
      if (queue.length === 0 || queue === null) return;

      const state = get();
      const trackID = _id ?? queue[0]._id;
      let queuePosition = queue.findIndex((track) => track._id === trackID);
      let newQueue = [...queue];

      if (queuePosition > -1) {
        const originalQueue = [...newQueue];
        const track = queue[queuePosition];

        player.setTrack(track);
        await player.play();

        if (state.shuffle) {
          newQueue = shuffleTracks(newQueue, queuePosition);
          queuePosition = 0;
        }

        log.debug('[PlayerStore] New queue started');

        set({
          queue: newQueue,
          originalQueue: originalQueue,
          queuePosition: queuePosition,
          playerStatus: PlayerStatus.PLAY,
        });
      }
    },
    play: async () => {
      await player.play();
      log.debug('[PlayerStore] PlayerStatus changed to PLAY');
      set({ playerStatus: PlayerStatus.PLAY });
    },
    pause: () => {
      player.pause();
      log.debug('[PlayerStore] PlayerStatus changed to PAUSE');
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

      log.debug('[PlayerStore] PlayerStatus changed to STOP');

      set({
        queue: [],
        originalQueue: [],
        queuePosition: null,
        playerStatus: PlayerStatus.STOP,
      });
    },
    previous: async () => {
      const { queue, queuePosition, repeat, api } = get();
      const currentTime = player.getCurrentTime();

      let newPosition: number;
      let debugMessage: string;

      if (queuePosition !== null) {
        if (currentTime > 5) {
          log.debug('[PlayerStore] Rewind track');
          api.setSongProgress(0);
          return;
        } else if (queuePosition === 0 && repeat === RepeatMode.ALL) {
          debugMessage = '[PlayerStore] Go to last track';
          newPosition = queue.length - 1;
        } else if (queuePosition !== 0) {
          debugMessage = '[PlayerStore] Go to previous track';
          newPosition = queuePosition - 1;
        } else {
          // This case is treated as if the track has been fully played and is now being considered as a new playback
          debugMessage = '[PlayerStore] Replay track';
          newPosition = queuePosition;
        }

        const track = queue[newPosition];

        if (track) {
          log.debug(debugMessage);
          player.setTrack(track);
          await player.play();

          set({
            queuePosition: newPosition,
            playerStatus: PlayerStatus.PLAY,
          });
        } else {
          log.error(
            '[PlayerStore] Error while switching to the previous track',
          );
          api.stop();
        }
      }
    },
    next: async () => {
      const { queue, queuePosition, repeat, api } = get();
      let newPosition: number;
      let debugMessage: string;

      if (queuePosition !== null) {
        if (repeat === RepeatMode.ONE) {
          debugMessage = '[PlayerStore] Replay track';
          newPosition = queuePosition;
        } else if (
          repeat === RepeatMode.ALL &&
          queuePosition === queue.length - 1
        ) {
          debugMessage = '[PlayerStore] Go to first track';
          newPosition = 0;
        } else if (
          repeat === RepeatMode.OFF &&
          queuePosition === queue.length - 1
        ) {
          log.debug('[PlayerStore] Player finished playing');
          api.pause();
          api.setSongProgress(0);
          return;
        } else {
          // This case is treated as if the track has been fully played and is now being considered as a new playback
          debugMessage = '[PlayerStore] Go to next track';
          newPosition = queuePosition + 1;
        }

        const track = queue[newPosition];

        if (track) {
          log.debug(debugMessage);
          player.setTrack(track);
          await player.play();

          set({
            playerStatus: PlayerStatus.PLAY,
            queuePosition: newPosition,
          });
        } else {
          log.error('[PlayerStore] Error while switching to the next track');
          api.setSongProgress(0);
          api.stop();
        }
      }
    },
    addToQueue: (tracks) => {
      const { queue, originalQueue } = get();
      const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
      const filteredArray = tracksArray.filter(
        (track) => !queue.includes(track),
      );

      const newQueue = [...queue, ...filteredArray];
      const newOriginalQueue = [...originalQueue, ...filteredArray];

      if (queue.length === 0) {
        const newQueuePosition = 0;
        const track = newQueue[newQueuePosition];

        player.setTrack(track);
        set({
          queuePosition: newQueuePosition,
        });
      }

      set({
        queue: newQueue,
        originalQueue: newOriginalQueue,
        playerStatus: PlayerStatus.PAUSE,
      });
    },
    playNext: (tracks) => {
      const { queue, originalQueue, queuePosition } = get();
      const tracksArray = Array.isArray(tracks) ? tracks : [tracks];
      const filteredArray = tracksArray.filter(
        (track) => !queue.includes(track),
      );
      let newQueue: TrackModel[] = [];
      let newOriginalQueue: TrackModel[] = [];

      if (queue.length !== 0 && queuePosition !== null) {
        newQueue = [...queue];
        newOriginalQueue = [...originalQueue];

        const currentTrack = queue[queuePosition];
        const index = newQueue.findIndex(
          (track) => track._id === currentTrack._id,
        );
        const originalIndex = newOriginalQueue.findIndex(
          (track) => track._id === currentTrack._id,
        );

        newQueue.splice(index + 1, 0, ...filteredArray);
        newOriginalQueue.splice(originalIndex + 1, 0, ...filteredArray);
      } else {
        newQueue = [...filteredArray];
        newOriginalQueue = [...filteredArray];

        const newQueuePosition = 0;
        const track = newQueue[newQueuePosition];

        player.setTrack(track);
        set({
          queuePosition: newQueuePosition,
          playerStatus: PlayerStatus.PAUSE,
        });
      }

      set({
        queue: newQueue,
        originalQueue: newOriginalQueue,
      });
    },
    removeFromQueue: async (tracks) => {
      const { queue, originalQueue, queuePosition, playerStatus, api } = get();
      const trackIDs = Array.isArray(tracks) ? tracks : [tracks];

      if (queue.length === 0 || queuePosition == null) return;

      let newPosition = queuePosition;
      const removedTracks = queue
        .map((track, index) => (trackIDs.includes(track._id) ? index : -1))
        .filter((index) => index !== -1);

      const newQueue = queue.filter((track) => {
        return !trackIDs.includes(track._id);
      });

      if (newQueue.length === 0) {
        api.stop();
        return;
      }

      removedTracks.forEach((trackIndex) => {
        if (trackIndex <= newPosition)
          newPosition = Math.max(newPosition - 1, 0);
      });

      if (trackIDs.includes(queue[queuePosition]._id)) {
        const track = newQueue[newPosition];
        player.setTrack(track);

        if (playerStatus === PlayerStatus.PLAY) {
          await player.play();
        }
      }

      set({
        queue: newQueue,
        originalQueue: originalQueue.filter((track) =>
          newQueue.includes(track),
        ),
        queuePosition: newPosition,
      });
    },
    jumpToTrack: async (_id) => {
      const { queue } = get();
      const queuePosition = queue.findIndex((track) => track._id === _id);

      if (queuePosition > -1) {
        const track = queue[queuePosition];

        log.debug(`[PlayerStore] Jump to track ${track.title}`);

        player.setTrack(track);
        await player.play();

        set({
          queuePosition: queuePosition,
          playerStatus: PlayerStatus.PLAY,
        });
      }
    },
    setVolume: (volume) => {
      player.setVolume(volume);
      saveVolume(volume);
    },
    setIsMuted: (muted = false) => {
      if (muted) {
        player.mute();
      } else {
        player.unmute();
      }
      set({ isMuted: muted });
    },
    toggleFavorite: async (_id) => {
      if (!_id && _id === '') return;

      const { queue } = get();
      const queuePosition = queue.findIndex((track) => track._id === _id);

      if (queuePosition > -1) {
        const track = queue[queuePosition];
        await window.VimpAPI.tracksDB.updateFavorite(track._id);

        log.debug(`[PlayerStore] Favorited track: ${track.title}`);

        const newQueue = [...queue];
        newQueue[queuePosition] = { ...track, favorite: !track.favorite };

        set({
          queue: newQueue,
        });
      }
    },
    toggleShuffle: async () => {
      const { queue, queuePosition, originalQueue } = get();
      const shuffle = !get().shuffle;

      await config.set('audioShuffle', shuffle);

      if (queuePosition === null) return;
      if (shuffle) {
        const newQueue = shuffleTracks([...queue], queuePosition);
        log.debug('[PlayerStore] Queue shuffled');

        set({
          queue: newQueue,
          queuePosition: 0,
          originalQueue: queue,
          shuffle: shuffle,
        });
      } else {
        const currentTrackID = queue[queuePosition]._id;
        const currentTrackIndex = originalQueue.findIndex(
          (track) => currentTrackID === track._id,
        );
        log.debug('[PlayerStore] Queue back original order');

        set({
          queue: [...originalQueue],
          queuePosition: currentTrackIndex,
          shuffle: shuffle,
        });
      }
    },
    toggleRepeat: async () => {
      const { repeat } = get();
      switch (repeat) {
        case RepeatMode.OFF: {
          log.debug('[PlayerStore] RepeatMode set to ALL');
          await config.set('audioRepeatMode', RepeatMode.ALL);
          set({ repeat: RepeatMode.ALL });
          break;
        }
        case RepeatMode.ALL: {
          log.debug('[PlayerStore] RepeatMode set to ONE');
          await config.set('audioRepeatMode', RepeatMode.ONE);
          set({ repeat: RepeatMode.ONE });
          break;
        }
        case RepeatMode.ONE: {
          log.debug('[PlayerStore] RepeatMode set to OFF');
          await config.set('audioRepeatMode', RepeatMode.OFF);
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
    updateQueue: (tracks) => {
      const { queue, originalQueue, queuePosition } = get();

      const updatedQueue = queue.map((track) => {
        const updatedTrack = tracks.find(
          (libraryTrack) => libraryTrack._id === track._id,
        );

        return updatedTrack ? { ...track, ...updatedTrack } : track;
      });

      const updatedOriginalQueue = originalQueue.map((track) => {
        const updatedTrack = tracks.find(
          (libraryTrack) => libraryTrack._id === track._id,
        );

        return updatedTrack ? { ...track, ...updatedTrack } : track;
      });

      let newQueuePosition = queuePosition;

      if (newQueuePosition !== null) {
        const currentTrack = updatedQueue[newQueuePosition];

        if (!currentTrack) {
          newQueuePosition = 0;
        }
      }

      log.debug('[PlayerStore] Queue updated');

      set({
        queue: updatedQueue,
        originalQueue: updatedOriginalQueue,
        queuePosition: newQueuePosition,
      });
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

const saveVolume = debounce(async (volume: number) => {
  log.debug(`[PlayerStore] Volume set to ${volume}`);
  await config.set('audioVolume', volume);
}, 500);

const shuffleTracks = (tracks: TrackModel[], index: number) => {
  const shuffledTracks = [...tracks];
  // Take the current track so we can return it to the first position
  const currentTrack = shuffledTracks.splice(index, 1)[0];

  //Shuffle
  for (let i = shuffledTracks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledTracks[i], shuffledTracks[j]] = [
      shuffledTracks[j],
      shuffledTracks[i],
    ];
  }

  // Mantain the current track on the first position
  shuffledTracks.unshift(currentTrack);

  return [...shuffledTracks];
};
