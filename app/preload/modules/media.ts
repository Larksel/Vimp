import { ipcRenderer } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';
import { Track } from '@shared/types/vimp';

export interface MediaInput {
  type: 'audio' | 'video';
  title: string;
  path: string;
  duration?: number | null;
  coverPath?: string | null;
  resolutionW?: number | null;
  resolutionH?: number | null;
  codec?: string | null;
  language?: string | null;
  isMissing?: boolean;
  externalId?: string | null;
  externalSource?: string | null;
}

const media = {
  getAll: (type?: 'audio' | 'video') => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_GET_ALL, type);
  },
  getById: (id: number) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_GET_BY_ID, id);
  },
  getByPath: (mediaPath: string) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_GET_BY_PATH, mediaPath);
  },
  create: (data: MediaInput) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_CREATE, data);
  },
  update: (id: number, data: Partial<MediaInput>) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_UPDATE, id, data);
  },
  deleteById: (id: number) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_DELETE_BY_ID, id);
  },
  importTrack: (track: Track) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_IMPORT_TRACK, track);
  },
  importTracks: (tracks: Track[]) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_IMPORT_TRACKS, tracks);
  },
  scanMissing: () => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_SCAN_MISSING);
  },
  recordAudioPlayback: (mediaId: number) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_RECORD_AUDIO_PLAYBACK, mediaId);
  },
  deleteByPath: (mediaPath: string) => {
    return ipcRenderer.invoke(IPCChannels.MEDIA_DELETE_BY_PATH, mediaPath);
  },
  onChanged: (callback: () => void) => {
    return ipcRenderer.on(IPCChannels.MEDIA_HAS_CHANGED, () => callback());
  },
};

export default media;
