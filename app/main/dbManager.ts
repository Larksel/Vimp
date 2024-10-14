import BaseWindowModule from '@modules/BaseWindowModule';
import { BrowserWindow } from 'electron';
import * as ModulesManager from '@main-utils/utils-modules';
import TracksDatabase from '@databases/tracksDB';
import { IDBManager } from '@interfaces/modules/IDBManager';

export default class DBManager extends BaseWindowModule implements IDBManager {
  private TracksDB: TracksDatabase;

  constructor(window: BrowserWindow) {
    super(window);

    this.TracksDB = new TracksDatabase(this.window);
  }

  protected async load() {
    await ModulesManager.init(this.TracksDB);
  }

  getTracksDB() {
    return this.TracksDB;
  }
}
