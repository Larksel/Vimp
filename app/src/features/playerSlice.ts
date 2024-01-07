import { createSlice } from '@reduxjs/toolkit';

type PlayerState = {
  player: {
    shuffle: boolean,
    isPlaying: boolean,
    repeat: 'off' | 'all' | 'one',
    songDuration: number,
    songProgress: number,
  }
}

export const playerSlice = createSlice({
  name: 'player',
  initialState: {
    shuffle: false,
    isPlaying: false,
    repeat: 'off',
    songDuration: 300,
    songProgress: 150,
  },
  reducers: {
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
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
  },
});

export const {
  toggleShuffle,
  togglePlayPause,
  changeRepeat,
  setSongDuration,
  setSongProgress,
} = playerSlice.actions;

export const selectShuffle = (state: PlayerState) => state.player.shuffle;
export const selectIsPlaying = (state: PlayerState) => state.player.isPlaying;
export const selectRepeat = (state: PlayerState) => state.player.repeat;
export const selectSongDuration = (state: PlayerState) => state.player.songDuration;
export const selectSongProgress = (state: PlayerState) => state.player.songProgress;

export default playerSlice.reducer;
