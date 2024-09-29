import path from 'path';
import { app } from 'electron';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import { GenericModel } from '@shared/types/vimp';
import { IGenericDatabase } from '@interfaces/databases/IGenericDatabase';

PouchDB.plugin(PouchDBFind);
const userDataPath = app.getPath('userData');

export default class GenericDatabase<T> implements IGenericDatabase<T> {
  protected db: PouchDB.Database;

  constructor(dbName: string) {
    this.db = new PouchDB(path.join(userDataPath, dbName), {
      adapter: 'leveldb',
      auto_compaction: true,
    });
  }

  // Bulk operations
  async insertMany(items: T[]) {
    const datedItems = items.map((item) => ({
      ...item,
      dateAdded: new Date(),
    }));

    return this.db.bulkDocs(datedItems);
  }

  // TODO Implementar
  async updateMany(items: GenericModel<T>[]) { return items }
  async deleteMany(items: GenericModel<T>[]) { return items }

  // CRUD operations
  async getAll() {
    const [firstResponse, secondResponse] = await Promise.all([
      this.db.allDocs({ include_docs: true, endkey: '_design' }),
      this.db.allDocs({ include_docs: true, startkey: '_design\uffff' }),
    ]);

    const items = [...firstResponse.rows, ...secondResponse.rows]
      .map((record) => record.doc)
      .filter(Boolean);

    return items;
  }

  async getById(itemID: string) {
    const { docs } = await this.db.find({
      selector: { _id: itemID },
    });

    return docs[0];
  }

  async update(item: GenericModel<T>) {
    const doc = await this.db.get(item._id);

    return this.db.put({ ...doc, ...item, dateModified: new Date() });
  }

  async delete(itemID: string) {
    const { docs } = await this.db.find({
      selector: { _id: itemID },
    });
    const items = docs;
    const deletedItems = items.map((item) => ({
      ...item,
      _deleted: true,
    }));

    await this.db.bulkDocs(deletedItems);
  }

  // * Helpers

  async clear() {
    const allItems = await this.getAll();
    const deletedItems = allItems.map((item) => {
      return {
        ...(item as GenericModel<T>),
        _deleted: true,
      };
    });
    if (!deletedItems) return;

    this.db.bulkDocs(deletedItems);
  }
}