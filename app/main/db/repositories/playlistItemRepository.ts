import { eq, and } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { playlistItems } from '../schema/playlistItems';

export default function createPlaylistItemRepository(db: VimpDB) {
  function insert(playlistId: number, mediaId: number, position: number) {
    return db
      .insert(playlistItems)
      .values({ playlistId, mediaId, position })
      .onConflictDoNothing()
      .returning({ id: playlistItems.id })
      .get();
  }

  function getById(id: number) {
    return db
      .select()
      .from(playlistItems)
      .where(eq(playlistItems.id, id))
      .get();
  }

  function getByPlaylistId(playlistId: number) {
    return db
      .select()
      .from(playlistItems)
      .where(eq(playlistItems.playlistId, playlistId))
      .all();
  }

  function getByMediaId(mediaId: number) {
    return db
      .select()
      .from(playlistItems)
      .where(eq(playlistItems.mediaId, mediaId))
      .all();
  }

  function updatePosition(id: number, position: number) {
    return db
      .update(playlistItems)
      .set({ position })
      .where(eq(playlistItems.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(playlistItems).where(eq(playlistItems.id, id)).run();
  }

  function deleteByPlaylistId(playlistId: number) {
    return db
      .delete(playlistItems)
      .where(eq(playlistItems.playlistId, playlistId))
      .run();
  }

  function deleteByMediaId(mediaId: number) {
    return db
      .delete(playlistItems)
      .where(eq(playlistItems.mediaId, mediaId))
      .run();
  }

  function deleteByIds(playlistId: number, mediaId: number) {
    return db
      .delete(playlistItems)
      .where(
        and(
          eq(playlistItems.playlistId, playlistId),
          eq(playlistItems.mediaId, mediaId),
        ),
      )
      .run();
  }

  return {
    insert,
    getById,
    getByPlaylistId,
    getByMediaId,
    updatePosition,
    deleteById,
    deleteByPlaylistId,
    deleteByMediaId,
    deleteByIds,
  };
}
