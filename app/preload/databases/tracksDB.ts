import { Track, GenericDBChannels } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import { createDatabaseIPC } from '../utils/ipcUtils';
import IPCChannels from '@shared/constants/IPCChannels';

ipcRenderer.removeAllListeners(IPCChannels.DB_HAS_CHANGED);

const tracksDBChannels: GenericDBChannels = {
  GET_ALL: IPCChannels.TRACKSDB_GET_ALL,
  GET_BY_ID: IPCChannels.TRACKSDB_GET_BY_ID,
  CREATE: IPCChannels.TRACKSDB_CREATE,
  UPDATE: IPCChannels.TRACKSDB_UPDATE,
  DELETE: IPCChannels.TRACKSDB_DELETE,
  CLEAR: IPCChannels.TRACKSDB_CLEAR,
}

const genericDBChannels = createDatabaseIPC<Track>(tracksDBChannels);

const tracksDB = {
  ...genericDBChannels,
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
