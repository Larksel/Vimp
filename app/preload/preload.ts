import { contextBridge, ipcRenderer } from 'electron';
import channels from '@shared/constants/ipc-channels';
import tracksDB from './modules/tracksDB';
import config from './modules/config';

const VimpAPI = {
  app: {
    pickFile: () => ipcRenderer.invoke(channels.PICK_FILES),
    openFile: () => ipcRenderer.invoke(channels.OPEN_FILE),
    getCover: (trackPath: string) =>
      ipcRenderer.invoke(channels.GET_COVER, trackPath),
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel)
  },
  library: {
    scanTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_SCAN_TRACKS, paths),
    importTracks: (paths: string[]) =>
      ipcRenderer.invoke(channels.LIBRARY_IMPORT_TRACKS, paths),
  },
  config,
  tracksDB,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
