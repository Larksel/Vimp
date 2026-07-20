import createMediaService from './mediaService';
import createPlaylistService from './playlistService';
import { Repositories } from '@main/db/types';

export default function createServices(repositories: Repositories) {
  return {
    mediaService: createMediaService(repositories),
    playlistService: createPlaylistService(repositories),
  };
}

export type VimpServices = ReturnType<typeof createServices>;
