import { Track, TrackModel } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';

ipcRenderer.removeAllListeners(IPCChannels.TRACKS_DB_CHANGED);

const tracksDB = {
  onTracksDBChanged: (callback: () => void) =>
    ipcRenderer.on(IPCChannels.TRACKS_DB_CHANGED, () => callback()),

  // * CRUD operations
  insertMany: (tracks: Track[]) =>
    ipcRenderer.invoke(IPCChannels.INSERT_TRACKS, tracks),
  getTracks: () => ipcRenderer.invoke(IPCChannels.GET_TRACKS),
  updateTrack: (track: TrackModel) =>
    ipcRenderer.invoke(IPCChannels.UPDATE_TRACK, track),
  delete: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.DELETE_TRACK, trackID),

  // * Getter functions
  getById: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.GET_TRACK_BY_ID, trackID),
  getByPath: (trackPath: string) =>
    ipcRenderer.invoke(IPCChannels.GET_TRACK_BY_PATH, trackPath),

  // * Features
  incrementPlayCount: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.INCREMENT_PLAY_COUNT, trackID),
  updateFavorite: (trackID: string) => 
    ipcRenderer.invoke(IPCChannels.TOGGLE_FAVORITE, trackID),
  updateLastPlayed: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.UPDATE_LAST_PLAYED, trackID),

  // * Helpers
  clearTracks: () => ipcRenderer.invoke(IPCChannels.CLEAR_TRACKS),
};

export default tracksDB;
