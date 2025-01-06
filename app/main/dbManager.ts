import BaseWindowModule from '@modules/BaseWindowModule';
import { BrowserWindow } from 'electron';
import * as ModulesManager from '@main-utils/utils-modules';
import TracksDatabase from '@databases/tracksDB';
import PlaylistsDatabase from '@databases/playlistsDB';
import { IDBManager } from '@interfaces/modules/IDBManager';

export default class DBManager extends BaseWindowModule implements IDBManager {
  private readonly TracksDB: TracksDatabase;
  private readonly PlaylistsDB: PlaylistsDatabase;

  constructor(window: BrowserWindow) {
    super(window);

    this.TracksDB = new TracksDatabase(this.window);
    this.PlaylistsDB = new PlaylistsDatabase(this.window, this.TracksDB);
  }

  protected async load() {
    await ModulesManager.init(this.TracksDB, this.PlaylistsDB);
  }

  getTracksDB() {
    return this.TracksDB;
  }

  getPlaylistsDB() {
    return this.PlaylistsDB;
  }
}
