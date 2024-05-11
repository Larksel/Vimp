import { contextBridge, ipcRenderer } from 'electron';
import channels from '../shared/lib/ipc-channels';
import db from './db';

const VimpAPI = {
  app: {
    pickFile: () => ipcRenderer.invoke(channels.PICK_FILES),
    openFile: () => ipcRenderer.invoke(channels.OPEN_FILE),
    getCover: (trackPath: string) =>
      ipcRenderer.invoke(channels.GET_COVER, trackPath),
  },
  db,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
