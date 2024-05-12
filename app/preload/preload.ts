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
  library: {
    scanTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_SCAN_TRACKS, paths),
    importTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_IMPORT_TRACKS, paths),
  },
  db,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
