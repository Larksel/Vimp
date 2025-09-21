import { Playlist, GenericDBChannels } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';
import { createDatabaseIPC } from '../utils/ipcUtils';
import IPCChannels from '@shared/constants/IPCChannels';

const playlistsDBChannels: GenericDBChannels = {
  GET_ALL: IPCChannels.PLAYLISTSDB_GET_ALL,
  GET_BY_ID: IPCChannels.PLAYLISTSDB_GET_BY_ID,
  CREATE: IPCChannels.PLAYLISTSDB_CREATE,
  UPDATE: IPCChannels.PLAYLISTSDB_UPDATE,
  DELETE: IPCChannels.PLAYLISTSDB_DELETE,
  CLEAR: IPCChannels.PLAYLISTSDB_CLEAR,
  HAS_CHANGED: IPCChannels.PLAYLISTSDB_HAS_CHANGED,
};

const genericDBChannels = createDatabaseIPC<Playlist>(playlistsDBChannels);

const playlistsDB = {
  ...genericDBChannels,
  incrementPlayCount: (playlistID: string) => {
    return ipcRenderer.invoke(
      IPCChannels.PLAYLISTSDB_INCREMENT_PLAY_COUNT,
      playlistID,
    );
  },
  updateFavorite: (playlistID: string) => {
    return ipcRenderer.invoke(
      IPCChannels.PLAYLISTSDB_UPDATE_FAVORITE,
      playlistID,
    );
  },
  updateLastPlayed: (playlistID: string) => {
    return ipcRenderer.invoke(
      IPCChannels.PLAYLISTSDB_UPDATE_LAST_PLAYED,
      playlistID,
    );
  },
};

export default playlistsDB;
