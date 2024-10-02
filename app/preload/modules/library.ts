import IPCChannels from '@shared/constants/IPCChannels';
import { ipcRenderer } from 'electron';

const library = {
  scanTracks: (paths: string[]) => {
    return ipcRenderer.invoke(IPCChannels.LIBRARY_SCAN_TRACKS, paths);
  },
  importTracks: (paths: string[]) => {
    return ipcRenderer.invoke(IPCChannels.LIBRARY_IMPORT_TRACKS, paths);
  },
};

export default library;
