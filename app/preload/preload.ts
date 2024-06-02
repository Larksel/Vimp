import { contextBridge, ipcRenderer } from 'electron';
import channels from '../shared/lib/ipc-channels';
import db from './db';
import { Config } from '../shared/types/vimp';

const VimpAPI = {
  app: {
    pickFile: () => ipcRenderer.invoke(channels.PICK_FILES),
    openFile: () => ipcRenderer.invoke(channels.OPEN_FILE),
    getCover: (trackPath: string) =>
      ipcRenderer.invoke(channels.GET_COVER, trackPath),
  },
  library: {
    scanTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_SCAN_TRACKS, paths),
    importTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_IMPORT_TRACKS, paths),
  },
  config: {
    __initialConfig: ipcRenderer.sendSync(channels.CONFIG_GET_ALL),
    getAll(): Promise<Config> {
      return ipcRenderer.invoke(channels.CONFIG_GET_ALL);
    },
    get<T extends keyof Config>(key: T): Promise<Config[T]> {
      return ipcRenderer.invoke(channels.CONFIG_GET, key);
    },
    set<T extends keyof Config>(key: T, value: Config[T]): Promise<void> {
      return ipcRenderer.invoke(channels.CONFIG_SET, key, value);
    },
  },
  db,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
