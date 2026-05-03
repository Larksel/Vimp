import { eq, and } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { mediaTags } from '../schema/mediaTags';

export default function createMediaTagRepository(db: VimpDB) {
  function insert(mediaId: number, tagId: number) {
    return db
      .insert(mediaTags)
      .values({ mediaId, tagId })
      .onConflictDoNothing()
      .run();
  }

  function getByMediaId(mediaId: number) {
    return db
      .select()
      .from(mediaTags)
      .where(eq(mediaTags.mediaId, mediaId))
      .all();
  }

  function getByTagId(tagId: number) {
    return db.select().from(mediaTags).where(eq(mediaTags.tagId, tagId)).all();
  }

  function deleteByMediaId(mediaId: number) {
    return db.delete(mediaTags).where(eq(mediaTags.mediaId, mediaId)).run();
  }

  function deleteByTagId(tagId: number) {
    return db.delete(mediaTags).where(eq(mediaTags.tagId, tagId)).run();
  }

  function deleteByIds(mediaId: number, tagId: number) {
    return db
      .delete(mediaTags)
      .where(and(eq(mediaTags.mediaId, mediaId), eq(mediaTags.tagId, tagId)))
      .run();
  }

  return {
    insert,
    getByMediaId,
    getByTagId,
    deleteByMediaId,
    deleteByTagId,
    deleteByIds,
  };
}
