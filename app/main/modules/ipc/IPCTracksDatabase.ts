import { ipcMain } from 'electron';
import { IDBManager } from '@interfaces/modules/IDBManager';
import { ITracksDatabase } from '@interfaces/databases/ITracksDatabase';
import { Track, TrackModel } from '@shared/types/vimp';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseModule from '@modules/BaseModule';

export default class IPCTracksDatabase extends BaseModule {
  private readonly TracksDB: ITracksDatabase;

  constructor(dbManager: IDBManager) {
    super();

    this.TracksDB = dbManager.getTracksDB();
  }

  protected async load() {
    // * CRUD operations

    ipcMain.handle(IPCChannels.TRACKSDB_INSERT_MANY, async (_, tracks: Track[]) => {
      await this.TracksDB.insertMany(tracks);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_GET_ALL, async () => {
      return this.TracksDB.getAll();
    });

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE, async (_, track: TrackModel) => {
      return this.TracksDB.update(track);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_DELETE, async (_, trackID: string) => {
      await this.TracksDB.delete(trackID);
    });

    // * Getter functions

    ipcMain.handle(IPCChannels.TRACKSDB_GET_BY_ID, async (_, trackID: string) => {
      return this.TracksDB.getById(trackID);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_GET_BY_PATH, async (_, trackPath: string) => {
      return this.TracksDB.getByPath(trackPath);
    });

    // * Features

    ipcMain.handle(
      IPCChannels.TRACKSDB_INCREMENT_PLAY_COUNT,
      async (_, trackID: string) => {

        await this.TracksDB.incrementPlayCount(trackID);
      },
    );

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE_FAVORITE, async (_, trackID: string) => {
      await this.TracksDB.updateFavorite(trackID);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE_LAST_PLAYED, async (_, trackID: string) => {
      await this.TracksDB.updateLastPlayed(trackID);
    });

    // * Helpers

    ipcMain.handle(IPCChannels.TRACKSDB_CLEAR, async () => {
      await this.TracksDB.clear();
    });
  }
}
