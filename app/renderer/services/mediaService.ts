import IPCChannels from '@shared/constants/IPCChannels';
import { AudioItem, VideoItem } from '@shared/types/entities';
import debounce from 'lodash/debounce';

export const mediaService = {
  getAudioItems: async (): Promise<AudioItem[]> => {
    return window.VimpAPI.media.getByType('audio');
  },
  getVideoItems: async (): Promise<VideoItem[]> => {
    return window.VimpAPI.media.getByType('video');
  },
  toggleFavorite: async (id: number): Promise<void> => {
    await window.VimpAPI.media.toggleFavorite(id);
  },
  recordAudioPlayback: async (id: number): Promise<void> => {
    await window.VimpAPI.media.recordAudioPlayback(id);
  },
  deleteById: async (id: number): Promise<void> => {
    await window.VimpAPI.media.deleteById(id);
  },
  loadAudioFile: async (path: string): Promise<ArrayBuffer> => {
    return window.VimpAPI.fileSystem.loadAudioFile(path);
  },
  onChanged: (callback: () => void) => {
    window.VimpAPI.media.onChanged(debounce(callback, 500));
  },
  clearListeners: () => {
    window.VimpAPI.app.removeAllListeners(IPCChannels.MEDIA_HAS_CHANGED);
  },
};
