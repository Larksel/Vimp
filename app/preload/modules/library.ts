import IPCChannels from '@shared/constants/IPCChannels';
import { ScannedFiles } from '@shared/types/vimp';
import { ipcRenderer } from 'electron';

const library = {
  scan: (paths: string[]): Promise<{ folders: string[]; files: string[] }> => {
    return ipcRenderer.invoke(IPCChannels.LIBRARY_SCAN, paths);
  },
  import: (paths: string[]): Promise<ScannedFiles | null> => {
    return ipcRenderer.invoke(IPCChannels.LIBRARY_IMPORT, paths);
  },
  scanAndSave: (paths?: string[]): Promise<ScannedFiles | null> => {
    return ipcRenderer.invoke(IPCChannels.LIBRARY_SCAN_AND_SAVE, paths);
  },
};

export default library;
