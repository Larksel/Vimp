import { StateCreator } from 'zustand';
import { PlayerStatus, RepeatMode, TrackModel } from '@shared/types/vimp';
import { storeUtils } from '@render-utils/storeUtils';
import { PlayerConfigService } from '@features/player/playerConfig';
import { PlayerService } from '@features/player';
import { QueueUtils } from '@renderer/utils/queueUtils';
import { TrackPersistenceService } from '@features/data';
import { createRendererLogger } from '@render-utils/logger';

const logger = createRendererLogger('PlayerStore');

interface PlayerState {
  queue: TrackModel[];
  originalQueue: TrackModel[];
  queuePosition: number | null;
  isShuffleEnabled: boolean;
  repeatMode: RepeatMode;
  playbackRate: number;
  volume: number;
  playerStatus: PlayerStatus;
  isPlayerMuted: boolean;
  gaplessPlayback: boolean;
  crossfadeDuration: number;
  api: {
    startPlayback: (queue: TrackModel[], _id?: string) => void;
    play: () => void;
    pause: () => void;
    togglePlayPause: () => void;
    stop: () => void;
    playPreviousTrack: () => void;
    playNextTrack: () => void;
    handleTrackEnd: () => void;
    playTrackAtIndex: (index: number) => void;
    addToQueue: (tracks: TrackModel | TrackModel[]) => void;
    queueNext: (tracks: TrackModel | TrackModel[]) => void;
    removeTracksFromQueue: (trackIDs: string | string[]) => void;
    playTrackById: (_id: string) => void;
    setVolume: (volume: number) => void;
    setIsMuted: (muted?: boolean) => void;
    toggleTrackFavorite: (_id: string) => Promise<void>;
    toggleShuffle: () => Promise<void>;
    toggleRepeatMode: () => Promise<void>;
    seekTo: (position: number) => void;
    setPlaybackRate: (playbackRate: number) => void;
    refreshQueueMetadata: (tracks: TrackModel[]) => void;
  };
}

const usePlayerStore = createPlayerStore<PlayerState>((set, get) => {
  const initialConfig = PlayerConfigService.getInitialConfig();

  logger.info(`Initializing player store with config: ${initialConfig}`);

  return {
    queue: [],
    originalQueue: [],
    queuePosition: null,
    isShuffleEnabled: initialConfig.audioShuffle,
    repeatMode: initialConfig.audioRepeatMode,
    playerStatus: PlayerStatus.STOP,
    isPlayerMuted: initialConfig.audioMuted,
    gaplessPlayback: initialConfig.audioGaplessPlayback,
    crossfadeDuration: initialConfig.audioCrossfadeDuration,
    playbackRate: initialConfig.audioPlaybackRate,
    volume: initialConfig.audioVolume,
    api: {
      startPlayback: (queue, _id) => {
        if (queue === null || queue.length === 0) return;

        const { isShuffleEnabled, api } = get();
        let newQueue = [...queue];
        const originalQueue = [...newQueue];
        const trackIndex = newQueue.findIndex((track) => track._id === _id);
        let queuePosition = trackIndex !== -1 ? trackIndex : 0;

        if (isShuffleEnabled) {
          newQueue = QueueUtils.shuffleTracks(newQueue, queuePosition);
          queuePosition = 0;
        }

        set({
          queue: newQueue,
          originalQueue: originalQueue,
        });

        logger.debug('New queue started');

        api.playTrackAtIndex(queuePosition);
      },
      play: () => {
        PlayerService.play();
        logger.debug('PlayerStatus changed to PLAY');
        set({ playerStatus: PlayerStatus.PLAY });
      },
      pause: () => {
        PlayerService.pause();
        logger.debug('PlayerStatus changed to PAUSE');
        set({ playerStatus: PlayerStatus.PAUSE });
      },
      togglePlayPause: () => {
        const { queue, api } = get();
        const { paused } = PlayerService.getAudio();

        if (paused && queue.length > 0) {
          api.play();
        } else {
          api.pause();
        }
      },
      stop: () => {
        PlayerService.stop();
        get().api.seekTo(0);

        logger.debug('PlayerStatus changed to STOP');

        set({
          queue: [],
          originalQueue: [],
          queuePosition: null,
          playerStatus: PlayerStatus.STOP,
        });
      },
      playPreviousTrack: () => {
        const { queue, queuePosition, api } = get();
        const currentTime = PlayerService.getCurrentTime();

        if (queuePosition === null || queue.length == 0) return;

        if (currentTime > 5) {
          logger.info('Rewind track');
          api.seekTo(0);
          return;
        }

        const isFirstTrack = queuePosition === 0;
        const newPosition = isFirstTrack ? queue.length - 1 : queuePosition - 1;

        logger.info('Go to previous track');

        api.playTrackAtIndex(newPosition);
      },
      playNextTrack: () => {
        const { queue, queuePosition, api } = get();

        if (queuePosition === null || queue.length == 0) return;

        const isLastTrack = queuePosition === queue.length - 1;
        const newPosition = isLastTrack ? 0 : queuePosition + 1;

        logger.info('Go to next track');

        api.playTrackAtIndex(newPosition);
      },
      handleTrackEnd: () => {
        const { queue, queuePosition, repeatMode, api } = get();

        if (queuePosition === null || queue.length == 0) return;

        const isLastTrack = queuePosition === queue.length - 1;
        let newPosition = queuePosition;

        switch (repeatMode) {
          // This case is treated as if the track has been fully played and is now being considered as a new playback
          case RepeatMode.OFF:
            PlayerService.setTrack(queue[queuePosition]);
            api.pause();
            logger.info('Player finished playing. Pausing...');
            return;

          case RepeatMode.ONE:
            logger.info('Repeating current track');
            break;

          case RepeatMode.ALL:
            newPosition = isLastTrack ? 0 : queuePosition + 1;
            logger.info(`Moving to ${isLastTrack ? 'first' : 'next'} track`);
            break;

          default:
            newPosition = queuePosition + 1;
            logger.info('Moving to next track');
            break;
        }

        api.playTrackAtIndex(newPosition);
      },
      playTrackAtIndex: (index) => {
        const { queue, api } = get();

        if (queue.length === 0) return;

        const track = queue[index];

        if (!track) {
          logger.error('Failed to find track');
          api.seekTo(0);
          api.stop();
          return;
        }

        logger.debug(`Playing track at index ${index}`);

        PlayerService.setTrack(track);
        api.play();

        set({
          playerStatus: PlayerStatus.PLAY,
          queuePosition: index,
        });
      },
      addToQueue: (tracks) => {
        const { queue, originalQueue } = get();
        const filteredTracks = QueueUtils.filterDuplicateTracks(queue, tracks);

        const newQueue = [...queue, ...filteredTracks];
        const newOriginalQueue = [...originalQueue, ...filteredTracks];

        set({
          queue: newQueue,
          originalQueue: newOriginalQueue,
        });

        if (queue.length === 0) {
          const newQueuePosition = 0;
          const track = newQueue[newQueuePosition];
          PlayerService.setTrack(track);
          set({
            queuePosition: newQueuePosition,
          });
        }
      },
      queueNext: (tracks) => {
        const { queue, originalQueue, queuePosition } = get();
        const tracksToAdd = QueueUtils.filterDuplicateTracks(queue, tracks);

        if (tracksToAdd.length === 0) return;

        let newQueue = [...queue];
        let newOriginalQueue = [...originalQueue];

        if (queue.length !== 0 && queuePosition !== null) {
          const currentTrackID = queue[queuePosition]._id;

          // Use the current track from the original queue to ensure correct insertion point
          const index = newQueue.findIndex(
            (track) => track._id === currentTrackID,
          );
          const originalIndex = newOriginalQueue.findIndex(
            (track) => track._id === currentTrackID,
          );

          newQueue.splice(index + 1, 0, ...tracksToAdd);
          newOriginalQueue.splice(originalIndex + 1, 0, ...tracksToAdd);
        } else {
          newQueue = [...tracksToAdd];
          newOriginalQueue = [...tracksToAdd];
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
        });
      },
      removeTracksFromQueue: (trackIDs) => {
        const { queue, originalQueue, queuePosition, playerStatus, api } =
          get();
        const trackIDsArray = Array.isArray(trackIDs) ? trackIDs : [trackIDs];

        if (
          queue.length === 0 ||
          trackIDsArray.length === 0 ||
          queuePosition === null
        )
          return;

        const removedTrackIDs = new Set(trackIDsArray);
        const newQueue = queue.filter(
          (track) => !removedTrackIDs.has(track._id),
        );

        if (newQueue.length === 0) {
          api.stop();
          return;
        }

        const newOriginalQueue = originalQueue.filter(
          (track) => !removedTrackIDs.has(track._id),
        );

        let newPosition = queuePosition;
        const currentTrackID = queue[queuePosition]._id;

        removedTrackIDs.forEach((trackID) => {
          const trackIndex = queue.findIndex((track) => track._id === trackID);
          if (trackIndex <= newPosition)
            newPosition = Math.max(newPosition - 1, 0);
        });

        if (trackIDsArray.includes(currentTrackID)) {
          const track = newQueue[newPosition];
          PlayerService.setTrack(track);

          if (playerStatus === PlayerStatus.PLAY) {
            api.play();
          }
        }

        set({
          queue: newQueue,
          originalQueue: newOriginalQueue,
          queuePosition: newPosition,
        });
      },
      playTrackById: (_id) => {
        const { queue, api } = get();
        const trackIndex = queue.findIndex((track) => track._id === _id);

        if (trackIndex === -1) return;

        api.playTrackAtIndex(trackIndex);
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
        set({ isPlayerMuted: muted });
      },
      toggleTrackFavorite: async (_id) => {
        if (!_id || _id === '') return;

        const { queue } = get();
        const trackIndex = queue.findIndex((track) => track._id === _id);

        if (trackIndex === -1) return;

        const track = queue[trackIndex];
        await TrackPersistenceService.updateFavorite(track._id);

        logger.info(`Favorited track: ${track.title}`);

        const newQueue = [...queue];
        newQueue[trackIndex] = { ...track, favorite: !track.favorite };

        set({
          queue: newQueue,
        });
      },
      toggleShuffle: async () => {
        const { queue, queuePosition, originalQueue, isShuffleEnabled } = get();
        const shouldShuffle = !isShuffleEnabled;

        if (queuePosition === null) return;

        let newQueue: TrackModel[];
        let newQueuePosition: number;

        if (shouldShuffle) {
          newQueue = QueueUtils.shuffleTracks([...queue], queuePosition);
          newQueuePosition = 0;

          logger.info('Queue shuffled');
        } else {
          const currentTrackID = queue[queuePosition]._id;
          const currentTrackIndex = originalQueue.findIndex(
            (track) => currentTrackID === track._id,
          );

          newQueue = [...originalQueue];
          newQueuePosition = currentTrackIndex !== -1 ? currentTrackIndex : 0;

          logger.info('Queue back to original order');
        }

        await PlayerConfigService.setAudioShuffle(shouldShuffle);

        set({
          queue: newQueue,
          queuePosition: newQueuePosition,
          isShuffleEnabled: shouldShuffle,
        });
      },
      toggleRepeatMode: async () => {
        const { repeatMode } = get();
        let newRepeatMode: RepeatMode;

        switch (repeatMode) {
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

        logger.debug(`Repeat mode set to ${newRepeatMode}`);

        await PlayerConfigService.setAudioRepeatMode(newRepeatMode);
        set({ repeatMode: newRepeatMode });
      },
      seekTo: (position) => {
        PlayerService.setCurrentTime(position);
      },
      setPlaybackRate: (playbackRate) => {
        if (playbackRate >= 0.25 && playbackRate <= 2) {
          PlayerService.setPlaybackRate(playbackRate);
          PlayerConfigService.setPlaybackRate(playbackRate);

          logger.debug(`Playback rate set to ${playbackRate}`);

          set({ playbackRate });
        }
      },
      refreshQueueMetadata: (tracks) => {
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

        logger.debug('Queue refreshed');

        set({
          queue: updatedQueue,
          originalQueue: updatedOriginalQueue,
          queuePosition: newQueuePosition,
        });
      },
    },
  };
});

export default usePlayerStore;

export function usePlayerAPI() {
  return usePlayerStore((state) => state.api);
}

function createPlayerStore<T extends PlayerState>(store: StateCreator<T>) {
  return storeUtils.createStore(store);
}
