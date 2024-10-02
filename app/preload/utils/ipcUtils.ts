import { ipcRenderer } from 'electron';
import { IGenericDatabase } from '@interfaces/databases/IGenericDatabase';
import { GenericModel } from '@shared/types/vimp';

export interface GenericChannels {
  INSERT_MANY: string;
  UPDATE_MANY: string;
  DELETE_MANY: string;
  GET_ALL: string;
  GET_BY_ID: string;
  UPDATE: string;
  DELETE: string;
  CLEAR: string;
}

export function createDatabaseIPC<T>(
  channels: GenericChannels,
): IGenericDatabase<T> {
  return {
    insertMany: (items: T[]) => {
      return ipcRenderer.invoke(channels.INSERT_MANY, items);
    },
    updateMany: (items: GenericModel<T>[]) => {
      return ipcRenderer.invoke(channels.UPDATE_MANY, items);
    },
    deleteMany: (items: GenericModel<T>[]) => {
      return ipcRenderer.invoke(channels.DELETE_MANY, items);
    },
    getAll: () => {
      return ipcRenderer.invoke(channels.GET_ALL);
    },
    getById: (itemID: string) => {
      return ipcRenderer.invoke(channels.GET_BY_ID, itemID);
    },
    update: (item: GenericModel<T>) => {
      return ipcRenderer.invoke(channels.UPDATE, item);
    },
    delete: (itemID: string) => {
      return ipcRenderer.invoke(channels.DELETE, itemID);
    },
    clear: () => {
      return ipcRenderer.invoke(channels.CLEAR);
    },
  };
}
