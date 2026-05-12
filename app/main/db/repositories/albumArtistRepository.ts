import { eq, and } from 'drizzle-orm';
import { InsertAlbumArtist, VimpDBExecutor } from '@main/types';
import { albumArtists } from '../schema/albumArtists';

export default function createAlbumArtistRepository(db: VimpDBExecutor) {
  function insert(data: InsertAlbumArtist) {
    return db.insert(albumArtists).values(data).onConflictDoNothing().run();
  }

  function getByAlbumId(albumId: number) {
    return db
      .select()
      .from(albumArtists)
      .where(eq(albumArtists.albumId, albumId))
      .all();
  }

  function getByArtistId(artistId: number) {
    return db
      .select()
      .from(albumArtists)
      .where(eq(albumArtists.artistId, artistId))
      .all();
  }

  function deleteByAlbumId(albumId: number) {
    return db
      .delete(albumArtists)
      .where(eq(albumArtists.albumId, albumId))
      .run();
  }

  function deleteByArtistId(artistId: number) {
    return db
      .delete(albumArtists)
      .where(eq(albumArtists.artistId, artistId))
      .run();
  }

  function deleteByIds(albumId: number, artistId: number) {
    return db
      .delete(albumArtists)
      .where(
        and(
          eq(albumArtists.albumId, albumId),
          eq(albumArtists.artistId, artistId),
        ),
      )
      .run();
  }

  return {
    insert,
    getByAlbumId,
    getByArtistId,
    deleteByAlbumId,
    deleteByArtistId,
    deleteByIds,
  };
}
