import { Track, TrackModel } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import channels from '@shared/constants/ipc-channels';

ipcRenderer.removeAllListeners(channels.TRACKS_DB_CHANGED);

const db = {
  onTracksDBChanged: (callback: () => void) =>
    ipcRenderer.on(channels.TRACKS_DB_CHANGED, () => callback()),

  // * CRUD operations
  insertMany: (tracks: Track[]) =>
    ipcRenderer.invoke(channels.INSERT_TRACKS, tracks),
  getTracks: () => ipcRenderer.invoke(channels.GET_TRACKS),
  updateTrack: (track: TrackModel) =>
    ipcRenderer.invoke(channels.UPDATE_TRACK, track),
  delete: (trackID: string) =>
    ipcRenderer.invoke(channels.DELETE_TRACK, trackID),

  // * Getter functions
  getById: (trackID: string) =>
    ipcRenderer.invoke(channels.GET_TRACK_BY_ID, trackID),
  getByPath: (trackPath: string) =>
    ipcRenderer.invoke(channels.GET_TRACK_BY_PATH, trackPath),

  // * Features
  incrementPlayCount: (trackID: string) =>
    ipcRenderer.invoke(channels.INCREMENT_PLAY_COUNT, trackID),
  updateFavorite: (trackID: string) => 
    ipcRenderer.invoke(channels.TOGGLE_FAVORITE, trackID),
  updateLastPlayed: (trackID: string) =>
    ipcRenderer.invoke(channels.UPDATE_LAST_PLAYED, trackID),

  // * Helpers
  clearTracks: () => ipcRenderer.invoke(channels.CLEAR_TRACKS),
};

export default db;
