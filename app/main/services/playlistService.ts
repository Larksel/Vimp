import createMediaRepository from '@main/db/repositories/mediaRepository';
import createPlaylistItemRepository from '@main/db/repositories/playlistItemRepository';
import createPlaylistRepository from '@main/db/repositories/playlistRepository';
import { InsertPlaylist, VimpDBExecutor, VimpDatabase } from '@main/types';

function createTxRepositories(db: VimpDBExecutor) {
  return {
    mediaRepository: createMediaRepository(db),
    playlistItemRepository: createPlaylistItemRepository(db),
    playlistRepository: createPlaylistRepository(db),
  };
}

export default function createPlaylistService(db: VimpDatabase) {
  function createPlaylist(data: InsertPlaylist) {
    const playlistRepository = createPlaylistRepository(db);
    return playlistRepository.insert(data);
  }

  function addMediaToPlaylist(
    playlistId: number,
    mediaId: number,
    position?: number,
  ) {
    return db.transaction((tx) => {
      const repositories = createTxRepositories(tx);
      const playlist = repositories.playlistRepository.getById(playlistId);
      const media = repositories.mediaRepository.getById(mediaId);

      if (!playlist) {
        throw new Error(`Playlist not found: ${playlistId}`);
      }

      if (!media) {
        throw new Error(`Media not found: ${mediaId}`);
      }

      const playlistItems =
        repositories.playlistItemRepository.getByPlaylistId(playlistId);
      const nextPosition =
        position ??
        playlistItems.reduce(
          (maxPosition, item) => Math.max(maxPosition, item.position),
          -1,
        ) + 1;

      return repositories.playlistItemRepository.insert({
        playlistId,
        mediaId,
        position: nextPosition,
      });
    });
  }

  function removeMediaFromPlaylist(playlistId: number, mediaId: number) {
    const playlistItemRepository = createPlaylistItemRepository(db);
    return playlistItemRepository.deleteByIds(playlistId, mediaId);
  }

  function movePlaylistItem(itemId: number, position: number) {
    const playlistItemRepository = createPlaylistItemRepository(db);
    return playlistItemRepository.updatePosition(itemId, position);
  }

  function removeMissingMediaFromPlaylists() {
    return db.transaction((tx) => {
      const repositories = createTxRepositories(tx);
      const playlists = repositories.playlistRepository.getAll();
      const removed: number[] = [];

      playlists.forEach((playlist) => {
        const items = repositories.playlistItemRepository.getByPlaylistId(
          playlist.id,
        );

        items.forEach((item) => {
          const media = repositories.mediaRepository.getById(item.mediaId);

          if (!media || media.isMissing) {
            repositories.playlistItemRepository.deleteById(item.id);
            removed.push(item.id);
          }
        });
      });

      return removed;
    });
  }

  return {
    createPlaylist,
    addMediaToPlaylist,
    removeMediaFromPlaylist,
    movePlaylistItem,
    removeMissingMediaFromPlaylists,
  };
}
