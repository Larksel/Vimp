import { eq, and } from 'drizzle-orm';
import { InsertMediaArtist, VimpDBExecutor } from '@main/types';
import { mediaArtists } from '../schema/mediaArtists';

export default function createMediaArtistRepository(db: VimpDBExecutor) {
  function insert(data: InsertMediaArtist) {
    return db.insert(mediaArtists).values(data).onConflictDoNothing().run();
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
    deleteByIds,
  };
}
