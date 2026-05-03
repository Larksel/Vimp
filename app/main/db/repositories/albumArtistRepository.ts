import { eq, and } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { albumArtists } from '../schema/albumArtists';

export default function createAlbumArtistRepository(db: VimpDB) {
  function insert(albumId: number, artistId: number) {
    return db
      .insert(albumArtists)
      .values({ albumId, artistId })
      .onConflictDoNothing()
      .run();
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
