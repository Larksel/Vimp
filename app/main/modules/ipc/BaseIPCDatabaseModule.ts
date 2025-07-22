import { ipcMain } from 'electron';
import BaseModule from '@main/modules/BaseModule';
import { IGenericDatabase } from '@shared/interfaces/databases/IGenericDatabase';
import { GenericModel, GenericDBChannels } from '@shared/types/vimp';

export default abstract class BaseIPCDatabaseModule<T> extends BaseModule {
  protected readonly db: IGenericDatabase<T>;
  private readonly channels: GenericDBChannels;

  constructor(db: IGenericDatabase<T>, channels: GenericDBChannels) {
    super();

    this.db = db;
    this.channels = channels;
  }

  /**
   * Setup generic DB ipc call functions for a given model
   */
  protected createGenericIPCHandlers() {
    // * CRUD operations
    ipcMain.handle(this.channels.GET_ALL, async () => {
      return this.db.getAll();
    });

    ipcMain.handle(this.channels.GET_BY_ID, async (_, itemID: string) => {
      return this.db.getById(itemID);
    });

    ipcMain.handle(this.channels.CREATE, async (_, items: T | T[]) => {
      await this.db.create(items);
    });

    ipcMain.handle(
      this.channels.UPDATE,
      async (_, items: GenericModel<T> | GenericModel<T>[]) => {
        return this.db.update(items);
      },
    );

    ipcMain.handle(
      this.channels.DELETE,
      async (_, items: GenericModel<T> | GenericModel<T>[]) => {
        await this.db.delete(items);
      },
    );

    // * Helpers
    ipcMain.handle(this.channels.CLEAR, async () => {
      await this.db.clear();
    });
  }
}
