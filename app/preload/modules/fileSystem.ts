import IPCChannels from '@shared/constants/IPCChannels';
import { ipcRenderer } from 'electron';

const fileSystem = {
  loadAudioFile: (filePath: string): Promise<ArrayBuffer> => {
    return ipcRenderer.invoke(IPCChannels.LOAD_AUDIO_FILE, filePath);
  },
};

export default fileSystem;