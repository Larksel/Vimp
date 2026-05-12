import { VimpDatabase } from '@main/types';
import createMediaService from './mediaService';
import createPlaylistService from './playlistService';

export default function createServices(db: VimpDatabase) {
  return {
    mediaService: createMediaService(db),
    playlistService: createPlaylistService(db),
  };
}

export type VimpServices = ReturnType<typeof createServices>;
