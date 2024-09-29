import { ipcMain } from 'electron';
import { TracksDB } from '@main/dbManager';
import { Track, TrackModel } from '@shared/types/vimp';

import channels from '@shared/constants/ipc-channels';
import BaseModule from '@modules/BaseModule';

export default class IPCDatabase extends BaseModule {
  constructor() {
    super();
  }

  protected async load() {
    // * CRUD operations

    ipcMain.handle(channels.INSERT_TRACKS, async (_, tracks: Track[]) => {
      await TracksDB.insertMany(tracks);
    });

    ipcMain.handle(channels.GET_TRACKS, async () => {
      return TracksDB.getAll();
    });

    ipcMain.handle(channels.UPDATE_TRACK, async (_, track: TrackModel) => {
      return TracksDB.update(track);
    });

    ipcMain.handle(channels.DELETE_TRACK, async (_, trackID: string) => {
      await TracksDB.delete(trackID);
    });

    // * Getter functions

    ipcMain.handle(channels.GET_TRACK_BY_ID, async (_, trackID: string) => {
      return TracksDB.getById(trackID);
    });

    ipcMain.handle(channels.GET_TRACK_BY_PATH, async (_, trackPath: string) => {
      return TracksDB.getByPath(trackPath);
    });

    // * Features

    ipcMain.handle(
      channels.INCREMENT_PLAY_COUNT,
      async (_, trackID: string) => {
        await TracksDB.incrementPlayCount(trackID);
      },
    );

    ipcMain.handle(channels.TOGGLE_FAVORITE, async (_, trackID: string) => {
      await TracksDB.updateFavorite(trackID);
    });

    ipcMain.handle(channels.UPDATE_LAST_PLAYED, async (_, trackID: string) => {
      await TracksDB.updateLastPlayed(trackID);
    });

    // * Helpers

    ipcMain.handle(channels.CLEAR_TRACKS, async () => {
      await TracksDB.clear();
    });
  }
}
