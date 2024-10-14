import { BrowserWindow, ipcMain } from 'electron';
import { TracksDB } from '@main/dbManager';
import { Track, TrackModel } from '@shared/types/vimp';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseWindowModule from '@modules/BaseWindowModule';

export default class IPCTracksDatabase extends BaseWindowModule {
  constructor(window: BrowserWindow) {
    super(window);
  }

  protected async load() {
    // * CRUD operations

    ipcMain.handle(IPCChannels.TRACKSDB_INSERT_MANY, async (_, tracks: Track[]) => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      await TracksDB.insertMany(tracks);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_GET_ALL, async () => {
      return TracksDB.getAll();
    });

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE, async (_, track: TrackModel) => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      return TracksDB.update(track);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_DELETE, async (_, trackID: string) => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      await TracksDB.delete(trackID);
    });

    // * Getter functions

    ipcMain.handle(IPCChannels.TRACKSDB_GET_BY_ID, async (_, trackID: string) => {
      return TracksDB.getById(trackID);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_GET_BY_PATH, async (_, trackPath: string) => {
      return TracksDB.getByPath(trackPath);
    });

    // * Features

    ipcMain.handle(
      IPCChannels.TRACKSDB_INCREMENT_PLAY_COUNT,
      async (_, trackID: string) => {
        this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
        await TracksDB.incrementPlayCount(trackID);
      },
    );

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE_FAVORITE, async (_, trackID: string) => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      await TracksDB.updateFavorite(trackID);
    });

    ipcMain.handle(IPCChannels.TRACKSDB_UPDATE_LAST_PLAYED, async (_, trackID: string) => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      await TracksDB.updateLastPlayed(trackID);
    });

    // * Helpers

    ipcMain.handle(IPCChannels.TRACKSDB_CLEAR, async () => {
      this.window.webContents.send(IPCChannels.TRACKSDB_HAS_CHANGED);
      await TracksDB.clear();
    });
  }
}
