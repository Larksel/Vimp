import { StateCreator } from 'zustand';
import { PlayerStatus, RepeatMode } from '@shared/types/vimp';
import { AudioItem } from '@shared/types/entities';
import { storeUtils } from '@renderer/utils/storeUtils';
import { QueueUtils } from '@renderer/utils/queueUtils';
import { mediaService } from '@renderer/services/mediaService';
import { createRendererLogger } from '@renderer/utils/logger';
import useConfigStore from './useConfigStore';
import useLibraryStore from './useLibraryStore';
import { arrayMove } from '@dnd-kit/sortable';
import getPlayer from '@renderer/core/player';
import { audioDispatcher } from '@renderer/core/audioDispatcher';

const logger = createRendererLogger('PlayerStore');

interface PlayerState {
  queue: AudioItem[];
  originalQueue: AudioItem[];
  queuePosition: number | null;
  currentTime: number;
  isShuffleEnabled: boolean;
  repeatMode: RepeatMode;
  playbackRate: number;
  volume: number;
  playerStatus: PlayerStatus;
  isPlayerMuted: boolean;
  gaplessPlayback: boolean;
  crossfadeDuration: number;
  api: {
    startPlayback: (queue: AudioItem[], id?: number) => void;
    play: () => Promise<void>;
    pause: () => void;
    togglePlayPause: () => void;
    stop: () => void;
    playPreviousTrack: () => void;
    playNextTrack: () => void;
    handleTrackEnd: () => void;
    playTrackAtIndex: (index: number) => void;
    addToQueue: (tracks: AudioItem | AudioItem[]) => void;
    queueNext: (tracks: AudioItem | AudioItem[]) => void;
    moveTrack: (from: number, to: number) => void;
    removeTracksFromQueue: (ids: number | number[]) => void;
    playTrackById: (id: number) => void;
    setVolume: (volume: number) => void;
    setIsMuted: (muted: boolean) => void;
    toggleTrackFavorite: (id: number) => Promise<void>;
    toggleShuffle: () => void;
    toggleRepeatMode: () => void;
    seekTo: (position: number) => void;
    handlePlayerTick: () => void;
    setPlaybackRate: (playbackRate: number) => void;
  };
}

const usePlayerStore = createPlayerStore<PlayerState>((set, get) => {
  const playerConfig = useConfigStore.getState().player;
  const configAPI = useConfigStore.getState().api;
  const libraryAPI = useLibraryStore.getState().api;
  const player = getPlayer();

  logger.info(
    `Initializing PlayerStore with config: ${JSON.stringify(playerConfig, null, 2)}`,
  );

  useLibraryStore.subscribe((state) => {
    const audio = state.contents.audio;
    logger.debug('Updating queue with new audio items');

    set((state) => {
      const updateItems = (queue: AudioItem[]) =>
        queue.map((item) => {
          const updated = audio.find((a) => a.id === item.id);
          return updated ? { ...item, ...updated } : item;
        });
      const newQueue = updateItems(state.queue);
      const newOriginalQueue = updateItems(state.originalQueue);
      let newQueuePosition = state.queuePosition;
      if (newQueuePosition !== null && !newQueue[newQueuePosition]) {
        newQueuePosition = 0;
      }
      return {
        queue: newQueue,
        originalQueue: newOriginalQueue,
        queuePosition: newQueuePosition,
      };
    });
  });

  return {
    queue: [],
    originalQueue: [],
    queuePosition: null,
    currentTime: 0,
    isShuffleEnabled: playerConfig.audioShuffle,
    repeatMode: playerConfig.audioRepeatMode,
    playerStatus: PlayerStatus.STOP,
    isPlayerMuted: playerConfig.audioMuted,
    gaplessPlayback: playerConfig.audioGaplessPlayback,
    crossfadeDuration: playerConfig.audioCrossfadeDuration,
    playbackRate: playerConfig.audioPlaybackRate,
    volume: playerConfig.audioVolume,
    api: {
      startPlayback: (queue, id) => {
        if (queue === null || queue.length === 0) return;

        const { isShuffleEnabled, api } = get();
        let newQueue = [...queue];
        const originalQueue = [...newQueue];
        const trackIndex = newQueue.findIndex((track) => track.id === id);
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
      play: async () => {
        try {
          await player.play();
          logger.debug('PlayerStatus changed to PLAY');
          audioDispatcher.setIsPlaying(true);
          set({ playerStatus: PlayerStatus.PLAY });
        } catch (err) {
          const api = get().api;

          api.stop();
          logger.error(`Player stopped by error: ${err}`);
        }
      },
      pause: () => {
        player.pause();
        logger.debug('PlayerStatus changed to PAUSE');
        audioDispatcher.setIsPlaying(false);
        set({ playerStatus: PlayerStatus.PAUSE });
      },
      togglePlayPause: () => {
        const { queue, api } = get();
        const { paused } = player.getAudio();

        if (paused && queue.length > 0) {
          api.play();
        } else {
          api.pause();
        }
      },
      stop: () => {
        player.stop();
        get().api.seekTo(0);

        logger.debug('PlayerStatus changed to STOP');
        audioDispatcher.setIsPlaying(false);

        set({
          queue: [],
          originalQueue: [],
          queuePosition: null,
          playerStatus: PlayerStatus.STOP,
        });
      },
      playPreviousTrack: () => {
        const { queue, queuePosition, api } = get();
        const currentTime = player.getCurrentTime();

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
      handleTrackEnd: async () => {
        const { queue, queuePosition, repeatMode, api } = get();

        if (queuePosition === null || queue.length == 0) return;

        const isLastTrack = queuePosition === queue.length - 1;
        let newPosition = queuePosition;

        switch (repeatMode) {
          // This case is treated as if the track has been fully played and is now being considered as a new playback
          case RepeatMode.OFF:
            await player.setTrack(queue[queuePosition]);
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
      playTrackAtIndex: async (index) => {
        const { queue, api } = get();

        if (queue.length === 0) return;

        const track = queue[index];

        if (!track) {
          logger.error('Failed to find track');
          api.stop();
          return;
        }

        logger.debug(`Playing track at index ${index}`);

        /*
          Zera o progresso da música atual antes de avançar para a próxima.
          Evita erros de discordancia entre o progresso atual e a duração da música ao trocar para uma com duração inferior.
        */
        api.seekTo(0);
        await player.setTrack(track);
        api.play();

        set({
          playerStatus: PlayerStatus.PLAY,
          queuePosition: index,
        });
      },
      addToQueue: async (tracks) => {
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
          await player.setTrack(track);
          set({
            queuePosition: newQueuePosition,
          });
        }
      },
      queueNext: async (tracks) => {
        const { queue, originalQueue, queuePosition } = get();
        const tracksToAdd = QueueUtils.filterDuplicateTracks(queue, tracks);

        if (tracksToAdd.length === 0) return;

        let newQueue = [...queue];
        let newOriginalQueue = [...originalQueue];

        if (queue.length !== 0 && queuePosition !== null) {
          const currentTrackID = queue[queuePosition].id;

          // Use the current track from the original queue to ensure correct insertion point
          const index = newQueue.findIndex(
            (track) => track.id === currentTrackID,
          );
          const originalIndex = newOriginalQueue.findIndex(
            (track) => track.id === currentTrackID,
          );

          newQueue.splice(index + 1, 0, ...tracksToAdd);
          newOriginalQueue.splice(originalIndex + 1, 0, ...tracksToAdd);
        } else {
          newQueue = [...tracksToAdd];
          newOriginalQueue = [...tracksToAdd];
          const newQueuePosition = 0;

          const track = newQueue[newQueuePosition];
          await player.setTrack(track);
          set({
            queuePosition: newQueuePosition,
          });
        }

        set({
          queue: newQueue,
          originalQueue: newOriginalQueue,
        });
      },
      moveTrack: (from, to) => {
        const { queue, queuePosition, isShuffleEnabled } = get();

        if (to === from) return;

        if (from > queue.length - 1 || to > queue.length - 1) {
          logger.error('Item out of range');
          return;
        }

        let newQueuePosition = queuePosition;

        if (queuePosition === from) {
          newQueuePosition = to;
        } else if (queuePosition === to) {
          if (to > from) {
            newQueuePosition = to - 1;
          } else {
            newQueuePosition = to + 1;
          }
        }

        const newQueue = arrayMove(queue, from, to);

        if (!isShuffleEnabled) {
          set({ originalQueue: newQueue });
        }

        set({ queue: newQueue, queuePosition: newQueuePosition });
      },
      removeTracksFromQueue: async (ids) => {
        const { queue, originalQueue, queuePosition, playerStatus, api } =
          get();
        const idsArray = Array.isArray(ids) ? ids : [ids];

        if (
          queue.length === 0 ||
          idsArray.length === 0 ||
          queuePosition === null
        )
          return;

        const removedIDs = new Set(idsArray);
        const newQueue = queue.filter((track) => !removedIDs.has(track.id));

        if (newQueue.length === 0) {
          api.stop();
          return;
        }

        const newOriginalQueue = originalQueue.filter(
          (track) => !removedIDs.has(track.id),
        );

        let newPosition = queuePosition;
        const currentTrackID = queue[queuePosition].id;

        removedIDs.forEach((id) => {
          const trackIndex = queue.findIndex((track) => track.id === id);
          if (trackIndex <= newPosition)
            newPosition = Math.max(newPosition - 1, 0);
        });

        if (idsArray.includes(currentTrackID)) {
          const track = newQueue[newPosition];
          await player.setTrack(track);

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
      playTrackById: (id) => {
        const { queue, api } = get();
        const trackIndex = queue.findIndex((track) => track.id === id);

        if (trackIndex === -1) return;

        api.playTrackAtIndex(trackIndex);
      },
      setVolume: (volume) => {
        player.setVolume(volume);
        configAPI.setVolume(volume);
        set({ volume });
      },
      setIsMuted: (muted) => {
        if (muted) {
          player.mute();
        } else {
          player.unmute();
        }

        configAPI.setAudioMuted(muted);
        set({ isPlayerMuted: muted });
      },
      toggleTrackFavorite: async (id) => {
        if (!id) return;

        const { queue } = get();
        const trackIndex = queue.findIndex((track) => track.id === id);

        if (trackIndex === -1) return;

        const track = queue[trackIndex];
        const updatedTrack: AudioItem = {
          ...track,
          isFavorite: !track.isFavorite,
          favoritedAt: !track.isFavorite ? new Date() : null,
        };

        libraryAPI.updateLocalAudio(updatedTrack);
        await mediaService.toggleFavorite(id);

        logger.info(`Favorited track: ${track.title}`);
      },
      toggleShuffle: () => {
        const { queue, queuePosition, originalQueue, isShuffleEnabled } = get();
        const shouldShuffle = !isShuffleEnabled;

        if (queuePosition === null) return;

        let newQueue: AudioItem[];
        let newQueuePosition: number;

        if (shouldShuffle) {
          newQueue = QueueUtils.shuffleTracks([...queue], queuePosition);
          newQueuePosition = 0;

          logger.info('Queue shuffled');
        } else {
          const currentTrackID = queue[queuePosition].id;
          const currentTrackIndex = originalQueue.findIndex(
            (track) => currentTrackID === track.id,
          );

          newQueue = [...originalQueue];
          newQueuePosition = currentTrackIndex !== -1 ? currentTrackIndex : 0;

          logger.info('Queue back to original order');
        }

        configAPI.setAudioShuffle(shouldShuffle);

        set({
          queue: newQueue,
          queuePosition: newQueuePosition,
          isShuffleEnabled: shouldShuffle,
        });
      },
      toggleRepeatMode: () => {
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

        configAPI.setAudioRepeatMode(newRepeatMode);
        set({ repeatMode: newRepeatMode });
      },
      seekTo: (position) => {
        player.setCurrentTime(position);
        set({ currentTime: position });
      },
      handlePlayerTick: () => {
        const currentTime = player.getCurrentTime();
        set({ currentTime });
      },
      setPlaybackRate: (playbackRate) => {
        if (playbackRate >= 0.25 && playbackRate <= 2) {
          player.setPlaybackRate(playbackRate);
          configAPI.setPlaybackRate(playbackRate);

          logger.debug(`Playback rate set to ${playbackRate}`);

          set({ playbackRate });
        }
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
