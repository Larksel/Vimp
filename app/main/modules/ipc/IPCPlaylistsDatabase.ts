import { ipcMain } from 'electron';
import { IDBManager } from '@shared/interfaces/modules/IDBManager';
import { IPlaylistsDatabase } from '@shared/interfaces/databases/IPlaylistsDatabase';
import { Playlist } from '@shared/types/vimp';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseIPCDatabaseModule from './BaseIPCDatabaseModule';

export default class IPCPlaylistsDatabase extends BaseIPCDatabaseModule<Playlist> {
  private readonly PlaylistsDB: IPlaylistsDatabase;

  constructor(dbManager: IDBManager) {
    super(dbManager.getPlaylistsDB(), {
      GET_ALL: IPCChannels.PLAYLISTSDB_GET_ALL,
      GET_BY_ID: IPCChannels.PLAYLISTSDB_GET_BY_ID,
      CREATE: IPCChannels.PLAYLISTSDB_CREATE,
      UPDATE: IPCChannels.PLAYLISTSDB_UPDATE,
      DELETE: IPCChannels.PLAYLISTSDB_DELETE,
      CLEAR: IPCChannels.PLAYLISTSDB_CLEAR,
    });

    this.PlaylistsDB = dbManager.getPlaylistsDB();
  }

  protected async load() {
    this.createGenericIPCHandlers();

    ipcMain.handle(
      IPCChannels.PLAYLISTSDB_INCREMENT_PLAY_COUNT,
      async (_, playlistID: string) => {
        await this.PlaylistsDB.incrementPlayCount(playlistID);
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLISTSDB_UPDATE_FAVORITE,
      async (_, playlistID: string) => {
        await this.PlaylistsDB.updateFavorite(playlistID);
      },
    );

    ipcMain.handle(
      IPCChannels.PLAYLISTSDB_UPDATE_LAST_PLAYED,
      async (_, playlistID: string) => {
        await this.PlaylistsDB.updateLastPlayed(playlistID);
      },
    );
  }
}
