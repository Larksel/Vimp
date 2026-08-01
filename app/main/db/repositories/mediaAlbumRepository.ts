import { eq, and } from 'drizzle-orm';
import { InsertMediaAlbum, VimpDBExecutor } from '@main/types';
import { mediaAlbums } from '../schema/mediaAlbums';

export default function createMediaAlbumRepository(db: VimpDBExecutor) {
  function insert(data: InsertMediaAlbum) {
    return db.insert(mediaAlbums).values(data).onConflictDoNothing().run();
  }

  function getByMediaId(mediaId: number) {
    return db
      .select()
      .from(mediaAlbums)
      .where(eq(mediaAlbums.mediaId, mediaId))
      .all();
  }

  function getByAlbumId(albumId: number) {
    return db
      .select()
      .from(mediaAlbums)
      .where(eq(mediaAlbums.albumId, albumId))
      .all();
  }

  function deleteByIds(mediaId: number, albumId: number) {
    return db
      .delete(mediaAlbums)
      .where(
        and(eq(mediaAlbums.mediaId, mediaId), eq(mediaAlbums.albumId, albumId)),
      )
      .run();
  }

  return {
    insert,
    getByMediaId,
    getByAlbumId,
    deleteByIds,
  };
}
