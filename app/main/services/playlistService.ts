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

  function getItems(playlistId: number) {
    return repositories.playlistItemRepository.getByPlaylistId(playlistId);
  }

  function addMediaToPlaylist(
    playlistId: number,
    mediaId: number,
    position?: number,
  ) {
    return repositories.transaction((tx) => {
      const playlist = tx.playlistRepository.getById(playlistId);
      const media = tx.mediaRepository.getById(mediaId);

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
      const playlists = tx.playlistRepository.getAll();
      const removed: number[] = [];

      playlists.forEach((playlist) => {
        const items = tx.playlistItemRepository.getByPlaylistId(playlist.id);

        items.forEach((item) => {
          const media = tx.mediaRepository.getById(item.mediaId);

          if (!media || media.isMissing) {
            tx.playlistItemRepository.deleteById(item.id);
            removed.push(item.id);
          }
        });
      });

      return removed;
    });
  }

  return {
    ...crudMethods,
    createPlaylist,
    getBySlug,
    getItems,
    addMediaToPlaylist,
    removeMediaFromPlaylist,
    movePlaylistItem,
    removeMissingMediaFromPlaylists,
  };
}
