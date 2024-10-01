import { contextBridge, ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';
import tracksDB from './modules/tracksDB';
import config from './modules/config';
import library from './modules/library';

const VimpAPI = {
  app: {
    pickFile: () => ipcRenderer.invoke(IPCChannels.DIALOG_PICK_FILES),
    openFile: () => ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE),
    getCover: (trackPath: string) =>
      ipcRenderer.invoke(IPCChannels.METADATA_GET_COVER, trackPath),
    removeAllListeners: (channel: IPCChannels) => ipcRenderer.removeAllListeners(channel)
  },
  library,
  config,
  tracksDB,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
