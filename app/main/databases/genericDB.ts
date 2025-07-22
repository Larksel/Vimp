import path from 'path';
import { app, BrowserWindow } from 'electron';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { GenericModel } from '@shared/types/vimp';
import { IGenericDatabase } from '@shared/interfaces/databases/IGenericDatabase';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import IPCChannels from '@shared/constants/IPCChannels';

PouchDB.plugin(PouchDBFind);
const userDataPath = app.getPath('userData');

export default abstract class GenericDatabase<T>
  extends BaseWindowModule
  implements IGenericDatabase<T>
{
  protected db: PouchDB.Database;

  constructor(dbName: string, window: BrowserWindow) {
    super(window);
    this.db = new PouchDB(path.join(userDataPath, dbName), {
      adapter: 'leveldb',
      auto_compaction: true,
    });
  }

  // CRUD operations
  async getAll() {
    const [firstResponse, secondResponse] = await Promise.all([
      this.db.allDocs({ include_docs: true, endkey: '_design' }),
      this.db.allDocs({ include_docs: true, startkey: '_design\uffff' }),
    ]);

    const items = [...firstResponse.rows, ...secondResponse.rows]
      .map((record) => record.doc)
      .filter(Boolean);

    return items as GenericModel<T>[];
  }

  async getById(itemID: string) {
    const { docs } = await this.db.find({
      selector: { _id: itemID },
    });

    return docs[0] as GenericModel<T>;
  }

  async create(items: T | T[]) {
    const itemsArray = Array.isArray(items) ? items : [items];

    const datedItems = itemsArray.map((item) => ({
      ...item,
      dateAdded: new Date(),
    }));
    const result = await this.db.bulkDocs(datedItems);

    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);

    return result;
  }

  async update(items: GenericModel<T> | GenericModel<T>[]) {
    const itemsArray = Array.isArray(items) ? items : [items];

    const updatedItems = itemsArray.map((item) => ({
      ...item,
      dateModified: new Date(),
    }));

    const result = await this.db.bulkDocs(updatedItems);

    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);

    return result;
  }

  async delete(items: GenericModel<T> | GenericModel<T>[]) {
    const itemsArray = Array.isArray(items) ? items : [items];

    const deletedItems = itemsArray.map((item) => ({
      ...item,
      _deleted: true,
    }));
    const result = await this.db.bulkDocs(deletedItems);

    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);

    return result;
  }

  // * Helpers

  async clear() {
    const allItems = await this.getAll();
    const deletedItems = allItems.map((item) => {
      return {
        ...item,
        _deleted: true,
      };
    });
    if (!deletedItems) return;

    await this.db.bulkDocs(deletedItems);
    this.window.webContents.send(IPCChannels.DB_HAS_CHANGED);
  }
}
