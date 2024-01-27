import { contextBridge, ipcRenderer } from 'electron';
import db from './db';

const VimpAPI = {
  app: {
    pickFile: () => ipcRenderer.invoke('pick-files'),
    openFile: () => ipcRenderer.invoke('open-file'),
    getCover: (trackPath: string) => ipcRenderer.invoke('getCover', trackPath)
  },
  window: {
    minimize: () => ipcRenderer.send('minimizeApp'),
    maximizeOrRestore: () => ipcRenderer.send('maximizeOrRestoreApp'),
    close: () => ipcRenderer.send('closeApp'),
    onWindowResize: (callback: (value: boolean) => void) => {
      ipcRenderer.on('window-resized', (_event, value) => callback(value));
    },
  },
  db,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
