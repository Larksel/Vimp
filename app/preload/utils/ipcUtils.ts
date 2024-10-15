import { ipcRenderer } from 'electron';
import { IGenericDatabase } from '@interfaces/databases/IGenericDatabase';
import { GenericModel } from '@shared/types/vimp';

export interface GenericChannels {
  GET_ALL: string;
  GET_BY_ID: string;
  CREATE: string;
  UPDATE: string;
  DELETE: string;
  CLEAR: string;
}

/**
 * Returns the generic DB ipc call functions for a given model
 */
export function createDatabaseIPC<T>(
  channels: GenericChannels,
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
