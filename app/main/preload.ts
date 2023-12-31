import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld('app', {
  minimize: () => ipcRenderer.send('minimizeApp'),
  maximizeOrRestore: () => ipcRenderer.send('maximizeOrRestoreApp'),
  close: () => ipcRenderer.send('closeApp'),
});
