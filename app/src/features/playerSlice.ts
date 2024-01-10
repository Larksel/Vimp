import { createSlice } from '@reduxjs/toolkit';

type PlayerState = {
  player: {
    shuffle: boolean;
    isPlaying: boolean;
    repeat: 'off' | 'all' | 'one';
    songDuration: number;
    songProgress: number;
    volume: number;
    isMuted: boolean;
  };
};

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    shuffle: false,
    isPlaying: false,
    repeat: 'off',
    songDuration: 300,
    songProgress: 150,
    volume: 67,
    isMuted: false,
  },
  reducers: {
    setShuffle: (state, action) => {
      state.shuffle = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    changeRepeat: (state) => {
      switch (state.repeat) {
        case 'off': {
          state.repeat = 'all';
          break;
        }
        case 'all': {
          state.repeat = 'one';
          break;
        }
        case 'one': {
          state.repeat = 'off';
          break;
        }
        default:
          break;
      }
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
  },
});

export const {
  setShuffle,
  setIsPlaying,
  changeRepeat,
  setSongDuration,
  setSongProgress,
  setVolume,
  setIsMuted,
} = playerSlice.actions;

export const selectShuffle = (state: PlayerState) => state.player.shuffle;
export const selectIsPlaying = (state: PlayerState) => state.player.isPlaying;
export const selectRepeat = (state: PlayerState) => state.player.repeat;
export const selectSongDuration = (state: PlayerState) =>
  state.player.songDuration;
export const selectSongProgress = (state: PlayerState) =>
  state.player.songProgress;
export const selectVolume = (state: PlayerState) => state.player.volume;
export const selectIsMuted = (state: PlayerState) => state.player.isMuted;

export default playerSlice.reducer;
