import { contextBridge, ipcRenderer } from 'electron';

const VimpAPI = {
  minimize: () => ipcRenderer.send('minimizeApp'),
  maximizeOrRestore: () => ipcRenderer.send('maximizeOrRestoreApp'),
  close: () => ipcRenderer.send('closeApp'),
  pickFile: () => ipcRenderer.invoke('pick-files'),
  openFile: () => ipcRenderer.invoke('open-file'),
  onWindowResize: (callback: (value: boolean) => void) =>
    ipcRenderer.on('window-resized', (_event, value) => callback(value)),
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
