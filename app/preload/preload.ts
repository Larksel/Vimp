import { contextBridge, ipcRenderer } from 'electron';

const VimpAPI = {
  minimize: () => ipcRenderer.send('minimizeApp'),
  maximizeOrRestore: () => ipcRenderer.send('maximizeOrRestoreApp'),
  close: () => ipcRenderer.send('closeApp'),
  pickFile: () => ipcRenderer.invoke('pick-files'),
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
