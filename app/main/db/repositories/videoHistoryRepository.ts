import { eq, desc } from 'drizzle-orm';
import { VimpDBExecutor, InsertVideoHistory } from '@main/types';
import { videoHistory } from '../schema/videoHistory';

export default function createVideoHistoryRepository(db: VimpDBExecutor) {
  function insert(data: InsertVideoHistory) {
    return db
      .insert(videoHistory)
      .values(data)
      .returning({ id: videoHistory.id })
      .get();
  }

  function getLatestByMediaId(mediaId: number) {
    return db
      .select()
      .from(videoHistory)
      .where(eq(videoHistory.mediaId, mediaId))
      .orderBy(desc(videoHistory.playedAt))
      .limit(1)
      .get();
  }

  function getAll() {
    return db
      .select()
      .from(videoHistory)
      .orderBy(desc(videoHistory.playedAt))
      .all();
  }

  function update(id: number, data: Partial<InsertVideoHistory>) {
    return db
      .update(videoHistory)
      .set(data)
      .where(eq(videoHistory.id, id))
      .run();
  }

  function deleteByMediaId(mediaId: number) {
    return db
      .delete(videoHistory)
      .where(eq(videoHistory.mediaId, mediaId))
      .run();
  }

  return {
    insert,
    getLatestByMediaId,
    getAll,
    update,
    deleteByMediaId,
  };
}
