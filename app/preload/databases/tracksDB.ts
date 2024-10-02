import { Track } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import { createDatabaseIPC, GenericChannels } from '../utils/ipcUtils';
import IPCChannels from '@shared/constants/IPCChannels';

ipcRenderer.removeAllListeners(IPCChannels.TRACKSDB_HAS_CHANGED);

const tracksDBChannels: GenericChannels = {
  INSERT_MANY: IPCChannels.TRACKSDB_INSERT_MANY,
  UPDATE_MANY: IPCChannels.TRACKSDB_UPDATE_MANY,
  DELETE_MANY: IPCChannels.TRACKSDB_DELETE_MANY,
  GET_ALL: IPCChannels.TRACKSDB_GET_ALL,
  GET_BY_ID: IPCChannels.TRACKSDB_GET_BY_ID,
  UPDATE: IPCChannels.TRACKSDB_UPDATE,
  DELETE: IPCChannels.TRACKSDB_DELETE,
  CLEAR: IPCChannels.TRACKSDB_CLEAR,
}

const genericDBChannels = createDatabaseIPC<Track>(tracksDBChannels);

const tracksDB = {
  ...genericDBChannels,
  onTracksDBChanged: (callback: () => void) => {
    return ipcRenderer.on(IPCChannels.TRACKSDB_HAS_CHANGED, () => callback());
  },
  getByPath: (trackPath: string) => {
    return ipcRenderer.invoke(IPCChannels.TRACKSDB_GET_BY_PATH, trackPath);
  },
  incrementPlayCount: (trackID: string) => {
    return ipcRenderer.invoke(IPCChannels.TRACKSDB_INCREMENT_PLAY_COUNT, trackID);
  },
  updateFavorite: (trackID: string) => {
    return ipcRenderer.invoke(IPCChannels.TRACKSDB_UPDATE_FAVORITE, trackID);
  },
  updateLastPlayed: (trackID: string) => {
    return ipcRenderer.invoke(IPCChannels.TRACKSDB_UPDATE_LAST_PLAYED, trackID);
  },
};

export default tracksDB;
