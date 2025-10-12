import { contextBridge, ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';
import tracksDB from './databases/tracksDB';
import config from './modules/config';
import library from './modules/library';
import playlistsDB from './databases/playlistsDB';
import fileSystem from './modules/fileSystem';

const VimpAPI = {
  app: {
    pickFile: () => {
      return ipcRenderer.invoke(IPCChannels.DIALOG_PICK_FILES);
    },
    openFile: () => {
      return ipcRenderer.invoke(IPCChannels.DIALOG_OPEN_FILE);
    },
    getCover: (trackPath: string) => {
      return ipcRenderer.invoke(IPCChannels.METADATA_GET_COVER, trackPath);
    },
    removeAllListeners: (channel: IPCChannels) => {
      return ipcRenderer.removeAllListeners(channel);
    },
  },
  library,
  config,
  tracksDB,
  playlistsDB,
  fileSystem,
};

contextBridge.exposeInMainWorld('VimpAPI', VimpAPI);

export type VimpAPI = typeof VimpAPI;
