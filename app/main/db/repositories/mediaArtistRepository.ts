import { eq, and } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { mediaArtists } from '../schema/mediaArtists';

export default function createMediaArtistRepository(db: VimpDB) {
  function insert(mediaId: number, artistId: number) {
    return db
      .insert(mediaArtists)
      .values({ mediaId, artistId })
      .onConflictDoNothing()
      .run();
  }

  function getByMediaId(mediaId: number) {
    return db
      .select()
      .from(mediaArtists)
      .where(eq(mediaArtists.mediaId, mediaId))
      .all();
  }

  function getByArtistId(artistId: number) {
    return db
      .select()
      .from(mediaArtists)
      .where(eq(mediaArtists.artistId, artistId))
      .all();
  }

  function deleteByMediaId(mediaId: number) {
    return db
      .delete(mediaArtists)
      .where(eq(mediaArtists.mediaId, mediaId))
      .run();
  }

  function deleteByArtistId(artistId: number) {
    return db
      .delete(mediaArtists)
      .where(eq(mediaArtists.artistId, artistId))
      .run();
  }

  function deleteByIds(mediaId: number, artistId: number) {
    return db
      .delete(mediaArtists)
      .where(
        and(
          eq(mediaArtists.mediaId, mediaId),
          eq(mediaArtists.artistId, artistId),
        ),
      )
      .run();
  }

  return {
    insert,
    getByMediaId,
    getByArtistId,
    deleteByMediaId,
    deleteByArtistId,
    deleteByIds,
  };
}
