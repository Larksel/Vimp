import { ipcRenderer } from 'electron';
import { GenericModel, GenericDBChannels } from '@shared/types/vimp';
import GenericDatabaseIPCHandlers from '@shared/interfaces/preload';

/**
 * Returns the generic DB ipc call functions for a given model
 */
export function createDatabaseIPC<T>(
  channels: GenericDBChannels,
): GenericDatabaseIPCHandlers<T> {
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
    onDBChanged: (callback: () => void) => {
      return ipcRenderer.on(channels.HAS_CHANGED, () => callback());
    },
  };
}
