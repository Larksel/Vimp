import { ipcMain } from 'electron';
import { IDBManager } from '@shared/interfaces/modules/IDBManager';
import { ITracksDatabase } from '@shared/interfaces/databases/ITracksDatabase';
import { Track } from '@shared/types/vimp';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseIPCDatabaseModule from './BaseIPCDatabaseModule';

export default class IPCTracksDatabase extends BaseIPCDatabaseModule<Track> {
  private readonly TracksDB: ITracksDatabase;

  constructor(dbManager: IDBManager) {
    super(dbManager.getTracksDB(), {
      GET_ALL: IPCChannels.TRACKSDB_GET_ALL,
      GET_BY_ID: IPCChannels.TRACKSDB_GET_BY_ID,
      CREATE: IPCChannels.TRACKSDB_CREATE,
      UPDATE: IPCChannels.TRACKSDB_UPDATE,
      DELETE: IPCChannels.TRACKSDB_DELETE,
      CLEAR: IPCChannels.TRACKSDB_CLEAR,
    });

    this.TracksDB = dbManager.getTracksDB();
  }

  protected async load() {
    this.createGenericIPCHandlers();

    ipcMain.handle(
      IPCChannels.TRACKSDB_GET_BY_PATH,
      async (_, trackPath: string) => {
        return this.TracksDB.getByPath(trackPath);
      },
    );

    ipcMain.handle(
      IPCChannels.TRACKSDB_INCREMENT_PLAY_COUNT,
      async (_, trackID: string) => {
        await this.TracksDB.incrementPlayCount(trackID);
      },
    );

    ipcMain.handle(
      IPCChannels.TRACKSDB_UPDATE_FAVORITE,
      async (_, trackID: string) => {
        await this.TracksDB.updateFavorite(trackID);
      },
    );

    ipcMain.handle(
      IPCChannels.TRACKSDB_UPDATE_LAST_PLAYED,
      async (_, trackID: string) => {
        await this.TracksDB.updateLastPlayed(trackID);
      },
    );
  }
}
