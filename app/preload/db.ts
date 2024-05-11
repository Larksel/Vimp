import { Track } from '../shared/types/vimp';
import { ipcRenderer } from 'electron';
import channels from '../shared/lib/ipc-channels';

const db = {
  // * CRUD operations
  insertMany: (tracks: Track[]) =>
    ipcRenderer.invoke(channels.INSERT_TRACKS, tracks),
  getTracks: () => ipcRenderer.invoke(channels.GET_TRACKS),
  updateTrack: (track: Track) =>
    ipcRenderer.invoke(channels.UPDATE_TRACK, track),
  delete: (trackID: string) =>
    ipcRenderer.invoke(channels.DELETE_TRACK, trackID),

  // * Getter functions
  getById: (trackID: string) =>
    ipcRenderer.invoke(channels.GET_TRACK_BY_ID, trackID),
  getByPath: (trackPath: string) =>
    ipcRenderer.invoke(channels.GET_TRACK_BY_PATH, trackPath),

  // * Features
  incrementPlayCount: (track: Track) =>
    ipcRenderer.invoke(channels.INCREMENT_PLAY_COUNT, track),
  updateFavorite: (track: Track) =>
    ipcRenderer.invoke(channels.TOGGLE_FAVORITE, track),
  updateLastPlayed: (track: Track) =>
    ipcRenderer.invoke(channels.UPDATE_LAST_PLAYED, track),

  // * Helpers
  clearTracks: () => ipcRenderer.invoke(channels.CLEAR_TRACKS),
};

export default db;
