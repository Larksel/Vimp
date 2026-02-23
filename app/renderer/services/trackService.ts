import IPCChannels from '@shared/constants/IPCChannels';
import { Track, TrackModel } from '@shared/types/vimp';
import debounce from 'lodash/debounce';

export const TrackService = {
  getAll: async () => {
    return await window.VimpAPI.tracksDB.getAll();
  },
  getById: async (trackID: string) => {
    return await window.VimpAPI.tracksDB.getById(trackID);
  },
  getByPath: async (trackPath: string) => {
    return await window.VimpAPI.tracksDB.getByPath(trackPath);
  },
  create: async (tracks: Track | Track[]) => {
    await window.VimpAPI.tracksDB.create(tracks);
  },
  update: async (tracks: TrackModel | TrackModel[]) => {
    await window.VimpAPI.tracksDB.update(tracks);
  },
  delete: async (tracks: TrackModel | TrackModel[]) => {
    await window.VimpAPI.tracksDB.delete(tracks);
  },
  updateLastPlayed: async (trackID: string) => {
    await window.VimpAPI.tracksDB.updateLastPlayed(trackID);
  },
  incrementPlayCount: async (trackID: string) => {
    await window.VimpAPI.tracksDB.incrementPlayCount(trackID);
  },
  updateFavorite: async (trackID: string) => {
    await window.VimpAPI.tracksDB.updateFavorite(trackID);
  },
  clear: async () => {
    await window.VimpAPI.tracksDB.clear();
  },
  onDBChanged: (callback: () => void) => {
    window.VimpAPI.tracksDB.onDBChanged(
      debounce(() => {
        callback();
      }, 500),
    );
  },
  clearListeners: () => {
    window.VimpAPI.app.removeAllListeners(IPCChannels.TRACKSDB_HAS_CHANGED);
  },
  loadAudioFile: async (path: string) => {
    return await window.VimpAPI.fileSystem.loadAudioFile(path);
  },
};
