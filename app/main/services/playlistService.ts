import { Repositories } from '@main/db/types';
import { InsertPlaylist } from '@main/types';
import { createCrudService } from './serviceHelper';

export default function createPlaylistService(repositories: Repositories) {
  const crudMethods = createCrudService(repositories.playlistRepository);

  function createPlaylist(data: InsertPlaylist) {
    return repositories.playlistRepository.insert(data);
  }

  function getBySlug(slug: string) {
    return repositories.playlistRepository.getBySlug(slug);
  }

  function addMediaToPlaylist(
    playlistId: number,
    mediaId: number,
    position?: number,
  ) {
    return repositories.transaction((tx) => {
      const playlist = tx.playlistRepository.getByIdSync(playlistId);
      const media = tx.mediaRepository.getByIdSync(mediaId);

      if (!playlist) {
        throw new Error(`Playlist not found: ${playlistId}`);
      }

      if (!media) {
        throw new Error(`Media not found: ${mediaId}`);
      }

      const playlistItems =
        tx.playlistItemRepository.getByPlaylistId(playlistId);
      const nextPosition =
        position ??
        playlistItems.reduce(
          (maxPosition, item) => Math.max(maxPosition, item.position),
          -1,
        ) + 1;

      return tx.playlistItemRepository.insert({
        playlistId,
        mediaId,
        position: nextPosition,
      });
    });
  }

  function removeMediaFromPlaylist(playlistId: number, mediaId: number) {
    return repositories.playlistItemRepository.deleteByIds(playlistId, mediaId);
  }

  function movePlaylistItem(itemId: number, position: number) {
    return repositories.playlistItemRepository.updatePosition(itemId, position);
  }

  function removeMissingMediaFromPlaylists() {
    return repositories.transaction((tx) => {
      const playlists = tx.playlistRepository.getAllSync();
      const removed: number[] = [];

      playlists.forEach((playlist) => {
        const items = tx.playlistItemRepository.getByPlaylistId(playlist.id);

        items.forEach((item) => {
          const media = tx.mediaRepository.getByIdSync(item.mediaId);

          if (!media || media.isMissing) {
            tx.playlistItemRepository.deleteById(item.id);
            removed.push(item.id);
          }
        });
      });

      return removed;
    });
  }

  function toggleFavorite(id: number) {
    return repositories.playlistRepository.toggleFavorite(id);
  }

  return {
    ...crudMethods,
    createPlaylist,
    getBySlug,
    addMediaToPlaylist,
    removeMediaFromPlaylist,
    movePlaylistItem,
    toggleFavorite,
    removeMissingMediaFromPlaylists,
  };
}
