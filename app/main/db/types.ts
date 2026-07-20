import createMediaRepository from './repositories/mediaRepository';
import createTagRepository from './repositories/tagRepository';
import createWatchedFolderRepository from './repositories/watchedFolderRepository';
import createAlbumRepository from './repositories/albumRepository';
import createArtistRepository from './repositories/artistRepository';
import createPlaylistRepository from './repositories/playlistRepository';
import createAlbumArtistRepository from './repositories/albumArtistRepository';
import createMediaAlbumRepository from './repositories/mediaAlbumRepository';
import createMediaArtistRepository from './repositories/mediaArtistRepository';
import createMediaTagRepository from './repositories/mediaTagRepository';
import createPlaylistItemRepository from './repositories/playlistItemRepository';
import createVideoHistoryRepository from './repositories/videoHistoryRepository';
import createAudioHistoryRepository from './repositories/audioHistoryRepository';

export interface BaseRepositories {
  albumArtistRepository: ReturnType<typeof createAlbumArtistRepository>;
  albumRepository: ReturnType<typeof createAlbumRepository>;
  artistRepository: ReturnType<typeof createArtistRepository>;
  audioHistoryRepository: ReturnType<typeof createAudioHistoryRepository>;
  mediaAlbumRepository: ReturnType<typeof createMediaAlbumRepository>;
  mediaArtistRepository: ReturnType<typeof createMediaArtistRepository>;
  mediaRepository: ReturnType<typeof createMediaRepository>;
  mediaTagRepository: ReturnType<typeof createMediaTagRepository>;
  playlistItemRepository: ReturnType<typeof createPlaylistItemRepository>;
  playlistRepository: ReturnType<typeof createPlaylistRepository>;
  tagRepository: ReturnType<typeof createTagRepository>;
  videoHistoryRepository: ReturnType<typeof createVideoHistoryRepository>;
  watchedFolderRepository: ReturnType<typeof createWatchedFolderRepository>;
}

export interface Repositories extends BaseRepositories {
  transaction<T>(work: (tx: BaseRepositories) => T): T;
}
