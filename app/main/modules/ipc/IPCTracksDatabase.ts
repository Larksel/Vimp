import { ipcMain } from 'electron';
import { TracksDB } from '@main/dbManager';
import { Track, TrackModel } from '@shared/types/vimp';

import IPCChannels from '@shared/constants/IPCChannels';
import BaseModule from '@modules/BaseModule';

export default class IPCTracksDatabase extends BaseModule {
  constructor() {
    super();
  }

  protected async load() {
    // * CRUD operations

    ipcMain.handle(IPCChannels.INSERT_TRACKS, async (_, tracks: Track[]) => {
      await TracksDB.insertMany(tracks);
    });

    ipcMain.handle(IPCChannels.GET_TRACKS, async () => {
      return TracksDB.getAll();
    });

    ipcMain.handle(IPCChannels.UPDATE_TRACK, async (_, track: TrackModel) => {
      return TracksDB.update(track);
    });

    ipcMain.handle(IPCChannels.DELETE_TRACK, async (_, trackID: string) => {
      await TracksDB.delete(trackID);
    });

    // * Getter functions

    ipcMain.handle(IPCChannels.GET_TRACK_BY_ID, async (_, trackID: string) => {
      return TracksDB.getById(trackID);
    });

    ipcMain.handle(IPCChannels.GET_TRACK_BY_PATH, async (_, trackPath: string) => {
      return TracksDB.getByPath(trackPath);
    });

    // * Features

    ipcMain.handle(
      IPCChannels.INCREMENT_PLAY_COUNT,
      async (_, trackID: string) => {
        await TracksDB.incrementPlayCount(trackID);
      },
    );

    ipcMain.handle(IPCChannels.TOGGLE_FAVORITE, async (_, trackID: string) => {
      await TracksDB.updateFavorite(trackID);
    });

    ipcMain.handle(IPCChannels.UPDATE_LAST_PLAYED, async (_, trackID: string) => {
      await TracksDB.updateLastPlayed(trackID);
    });

    // * Helpers

    ipcMain.handle(IPCChannels.CLEAR_TRACKS, async () => {
      await TracksDB.clear();
    });
  }
}
