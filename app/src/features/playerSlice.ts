import { createSlice } from '@reduxjs/toolkit';
import { RepeatMode, Track } from '../../shared/types/vimp';

type PlayerState = {
  player: {
    shuffle: boolean;
    isPlaying: boolean;
    repeat: RepeatMode;
    songDuration: number;
    songProgress: number;
    volume: number;
    isMuted: boolean;
    playbackRate: number;
    currentTrack: Track;
  };
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    currentTrack: {},
    shuffle: false,
    isPlaying: false,
    repeat: RepeatMode.OFF,
    songDuration: 0,
    songProgress: 0,
    volume: 67,
    isMuted: false,
    playbackRate: 1,
  },
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    changeRepeat: (state, action) => {
      state.repeat = action.payload;
    },
    setSongDuration: (state, action) => {
      state.songDuration = action.payload;
    },
    setSongProgress: (state, action) => {
      state.songProgress = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setIsMuted: (state, action) => {
      state.isMuted = action.payload;
    },
    setPlaybackRate: (state, action) => {
      state.playbackRate = action.payload;
    },
  },
});

export const {
  setCurrentTrack,
  setShuffle,
  setIsPlaying,
  changeRepeat,
  setSongDuration,
  setSongProgress,
  setVolume,
  setIsMuted,
  setPlaybackRate,
} = playerSlice.actions;

//TODO encontrar um jeito melhor de fazer isso
export const selectCurrentTrack = (state: PlayerState) =>
  state.player.currentTrack;
export const selectShuffle = (state: PlayerState) => state.player.shuffle;
export const selectIsPlaying = (state: PlayerState) => state.player.isPlaying;
export const selectRepeat = (state: PlayerState) => state.player.repeat;
export const selectSongDuration = (state: PlayerState) =>
  state.player.songDuration;
export const selectSongProgress = (state: PlayerState) =>
  state.player.songProgress;
export const selectVolume = (state: PlayerState) => state.player.volume;
export const selectIsMuted = (state: PlayerState) => state.player.isMuted;
export const selectPlaybackRate = (state: PlayerState) =>
  state.player.playbackRate;

export default playerSlice.reducer;
