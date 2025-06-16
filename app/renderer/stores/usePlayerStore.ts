import { StateCreator } from 'zustand';
import log from 'electron-log/renderer';
import { PlayerStatus, RepeatMode, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';
import { PlayerConfigService } from '@features/player/playerConfig';
import { PlayerService } from '@features/player';
import { QueueUtils } from '@renderer/utils/queueUtils';

interface PlayerState {
  queue: TrackModel[];
  originalQueue: TrackModel[];
  queuePosition: number | null;
  shuffle: boolean;
  repeat: RepeatMode;
  playbackRate: number;
  volume: number;
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

const initialConfig = PlayerConfigService.getInitialConfig();
const usePlayerStore = createPlayerStore<PlayerState>((set, get) => ({
  queue: [],
  originalQueue: [],
  queuePosition: null,
  shuffle: initialConfig.audioShuffle,
  repeat: initialConfig.audioRepeatMode,
  playerStatus: PlayerStatus.STOP,
  isMuted: initialConfig.audioMuted,
  gaplessPlayback: initialConfig.audioGaplessPlayback,
  crossfadeDuration: initialConfig.audioCrossfadeDuration,
  playbackRate: initialConfig.audioPlaybackRate,
  volume: initialConfig.audioVolume,
  api: {
    start: async (queue, _id) => {
      if (queue === null || queue.length === 0) return;

      let newQueue = [...queue];
      const trackID = _id ?? newQueue[0]._id;
      let queuePosition = newQueue.findIndex((track) => track._id === trackID);

      if (queuePosition > -1) {
        const originalQueue = [...newQueue];

        if (get().shuffle) {
          newQueue = QueueUtils.shuffleTracks(newQueue, queuePosition);
          queuePosition = 0;
        }

        const track = newQueue[queuePosition];

        PlayerService.setTrack(track);
        await PlayerService.play();

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
      await PlayerService.play();
      log.debug('[PlayerStore] PlayerStatus changed to PLAY');
      set({ playerStatus: PlayerStatus.PLAY });
    },
    pause: () => {
      PlayerService.pause();
      log.debug('[PlayerStore] PlayerStatus changed to PAUSE');
      set({ playerStatus: PlayerStatus.PAUSE });
    },
    playPause: async () => {
      const playerAPI = get().api;
      const { queue } = get();
      const { paused } = PlayerService.getAudio();

      if (paused && queue.length > 0) {
        await playerAPI.play();
      } else {
        playerAPI.pause();
      }
    },
    stop: () => {
      PlayerService.stop();
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
      const currentTime = PlayerService.getCurrentTime();

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
          PlayerService.setTrack(track);
          await PlayerService.play();

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
          PlayerService.setTrack(track);
          await PlayerService.play();

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
      const filteredTracks = QueueUtils.filterDuplicateTracks(queue, tracks);

      const newQueue = [...queue, ...filteredTracks];
      const newOriginalQueue = [...originalQueue, ...filteredTracks];

      if (queue.length === 0) {
        const newQueuePosition = 0;
        const track = newQueue[newQueuePosition];
        PlayerService.setTrack(track);
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
      const filteredTracks = QueueUtils.filterDuplicateTracks(queue, tracks);

      let newQueue: TrackModel[] = [];
      let newOriginalQueue: TrackModel[] = [];

      if (queue.length !== 0 && queuePosition !== null) {
        newQueue = [...queue];
        newOriginalQueue = [...originalQueue];

        // Use the current track from the original queue to ensure correct insertion point
        const currentTrack = queue[queuePosition];
        const index = newQueue.findIndex(
          (track) => track._id === currentTrack._id,
        );
        const originalIndex = newOriginalQueue.findIndex(
          (track) => track._id === currentTrack._id,
        );

        newQueue.splice(index + 1, 0, ...filteredTracks);
        newOriginalQueue.splice(originalIndex + 1, 0, ...filteredTracks);
      } else {
        newQueue = [...filteredTracks];
        newOriginalQueue = [...filteredTracks];

        const newQueuePosition = 0;
        const track = newQueue[newQueuePosition];
        PlayerService.setTrack(track);
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
      if (queue.length === 0) return;

      const trackIDs = Array.isArray(tracks) ? tracks : [tracks];
      const removedTrackIDs = new Set(trackIDs);
      const newQueue = queue.filter((track) => !removedTrackIDs.has(track._id));

      if (newQueue.length === 0) {
        api.stop();
        return;
      }

      if (queuePosition === null) return;
      let newPosition = queuePosition;

      removedTrackIDs.forEach((trackID) => {
        const trackIndex = queue.findIndex((track) => track._id === trackID);
        if (trackIndex <= newPosition)
          newPosition = Math.max(newPosition - 1, 0);
      });

      if (trackIDs.includes(queue[queuePosition]._id)) {
        const track = newQueue[newPosition];
        PlayerService.setTrack(track);

        if (playerStatus === PlayerStatus.PLAY) {
          await PlayerService.play();
        }
      }

      set({
        queue: newQueue,
        originalQueue: originalQueue.filter(
          (track) => !removedTrackIDs.has(track._id),
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

        PlayerService.setTrack(track);
        await PlayerService.play();

        set({
          queuePosition: queuePosition,
          playerStatus: PlayerStatus.PLAY,
        });
      }
    },
    setVolume: (volume) => {
      PlayerService.setVolume(volume);
      PlayerConfigService.setVolume(volume);
      set({ volume });
    },
    setIsMuted: async (muted = false) => {
      if (muted) {
        PlayerService.mute();
      } else {
        PlayerService.unmute();
      }

      await PlayerConfigService.setAudioMuted(muted);
      set({ isMuted: muted });
    },
    toggleFavorite: async (_id) => {
      if (!_id || _id === '') return;

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

      await PlayerConfigService.setAudioShuffle(shuffle);

      if (queuePosition === null) return;

      if (shuffle) {
        const newQueue = QueueUtils.shuffleTracks([...queue], queuePosition);
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
        log.debug('[PlayerStore] Queue back to original order');

        set({
          queue: [...originalQueue],
          queuePosition: currentTrackIndex !== -1 ? currentTrackIndex : 0,
          shuffle: shuffle,
        });
      }
    },
    toggleRepeat: async () => {
      const { repeat } = get();
      let newRepeatMode: RepeatMode;

      switch (repeat) {
        case RepeatMode.OFF:
          newRepeatMode = RepeatMode.ALL;
          break;
        case RepeatMode.ALL:
          newRepeatMode = RepeatMode.ONE;
          break;
        case RepeatMode.ONE:
          newRepeatMode = RepeatMode.OFF;
          break;
        default:
          newRepeatMode = RepeatMode.OFF;
      }

      await PlayerConfigService.setAudioRepeatMode(newRepeatMode);
      set({ repeat: newRepeatMode });
    },
    setSongProgress: (progress) => {
      PlayerService.setCurrentTime(progress);
    },
    setPlaybackRate: (playbackRate) => {
      if (playbackRate >= 0.25 && playbackRate <= 2) {
        PlayerService.setPlaybackRate(playbackRate);
        PlayerConfigService.setPlaybackRate(playbackRate);
        set({ playbackRate });
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

      // If the current track was updated or removed from the library (and thus from the queue)
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
  return storeUtils.createStore(store);
}
