import { ipcRenderer } from 'electron';
import { IGenericDatabase } from '@interfaces/databases/IGenericDatabase';
import { GenericModel, GenericDBChannels } from '@shared/types/vimp';

/**
 * Returns the generic DB ipc call functions for a given model
 */
export function createDatabaseIPC<T>(
  channels: GenericDBChannels,
): IGenericDatabase<T> {
  return {
    getAll: () => {
      return ipcRenderer.invoke(channels.GET_ALL);
    },
    getById: (itemID: string) => {
      return ipcRenderer.invoke(channels.GET_BY_ID, itemID);
    },
    create: (items: T | T[]) => {
      return ipcRenderer.invoke(channels.CREATE, items);
    },
    update: (items: GenericModel<T> | GenericModel<T>[]) => {
      return ipcRenderer.invoke(channels.UPDATE, items);
    },
    delete: (items: GenericModel<T> | GenericModel<T>[]) => {
      return ipcRenderer.invoke(channels.DELETE, items);
    },
    clear: () => {
      return ipcRenderer.invoke(channels.CLEAR);
    },
  };
}
