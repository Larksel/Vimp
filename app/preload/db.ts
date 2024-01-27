import { Track } from '../shared/types/vimp';
import { ipcRenderer } from 'electron';

const db = {
  // * CRUD operations
  insertMany: (tracks: Track[]) => ipcRenderer.invoke('insertMany', tracks),
  getTracks: () => ipcRenderer.invoke('getTracks'),
  updateTrack: (track: Track) => ipcRenderer.invoke('updateTrack', track),
  delete: (trackID: string) => ipcRenderer.invoke('deleteTrack', trackID),
  // * Getter functions
  getById: (trackID: string) => ipcRenderer.invoke('getById', trackID),
  getByPath: (trackPath: string) => ipcRenderer.invoke('getByPath', trackPath),
  // * Features
  incrementPlayCount: (track: Track) => ipcRenderer.invoke('incrementPlayCount', track),
  updateFavorite: (track: Track) => ipcRenderer.invoke('updateFavorite', track),
  updateLastPlayed: (track: Track) => ipcRenderer.invoke('updateLastPlayed', track),
  // * Helpers 
  clearTracks: () => ipcRenderer.invoke('clearTracks'),
};

export default db;
