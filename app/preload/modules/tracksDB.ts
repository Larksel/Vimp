import { Track, TrackModel } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';

ipcRenderer.removeAllListeners(IPCChannels.TRACKSDB_HAS_CHANGED);

const tracksDB = {
  onTracksDBChanged: (callback: () => void) =>
    ipcRenderer.on(IPCChannels.TRACKSDB_HAS_CHANGED, () => callback()),

  // * CRUD operations
  insertMany: (tracks: Track[]) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_INSERT_MANY, tracks),
  getTracks: () => ipcRenderer.invoke(IPCChannels.TRACKSDB_GET_ALL),
  updateTrack: (track: TrackModel) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_UPDATE, track),
  delete: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_DELETE, trackID),

  // * Getter functions
  getById: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_GET_BY_ID, trackID),
  getByPath: (trackPath: string) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_GET_BY_PATH, trackPath),

  // * Features
  incrementPlayCount: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_INCREMENT_PLAY_COUNT, trackID),
  updateFavorite: (trackID: string) => 
    ipcRenderer.invoke(IPCChannels.TRACKSDB_UPDATE_FAVORITE, trackID),
  updateLastPlayed: (trackID: string) =>
    ipcRenderer.invoke(IPCChannels.TRACKSDB_UPDATE_LAST_PLAYED, trackID),

  // * Helpers
  clearTracks: () => ipcRenderer.invoke(IPCChannels.TRACKSDB_CLEAR),
};

export default tracksDB;
