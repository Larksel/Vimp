import { eq, sql, desc } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { audioHistory } from '../schema/audioHistory';

export default function createAudioHistoryRepository(db: VimpDB) {
  function insert(mediaId: number) {
    return db
      .insert(audioHistory)
      .values({ mediaId, playCount: 0 })
      .onConflictDoNothing()
      .run();
  }

  function getByMediaId(mediaId: number) {
    return db
      .select()
      .from(audioHistory)
      .where(eq(audioHistory.mediaId, mediaId))
      .get();
  }

  function getAll() {
    return db
      .select()
      .from(audioHistory)
      .orderBy(desc(audioHistory.lastPlayedAt))
      .all();
  }

  function incrementPlayCount(mediaId: number) {
    return db
      .update(audioHistory)
      .set({
        playCount: sql`${audioHistory.playCount} + 1`,
        lastPlayedAt: new Date(),
      })
      .where(eq(audioHistory.mediaId, mediaId))
      .run();
  }

  function updateLastPlayed(mediaId: number) {
    return db
      .update(audioHistory)
      .set({ lastPlayedAt: new Date() })
      .where(eq(audioHistory.mediaId, mediaId))
      .run();
  }

  function resetPlayCount(mediaId: number) {
    return db
      .update(audioHistory)
      .set({ playCount: 0 })
      .where(eq(audioHistory.mediaId, mediaId))
      .run();
  }

  function deleteByMediaId(mediaId: number) {
    return db
      .delete(audioHistory)
      .where(eq(audioHistory.mediaId, mediaId))
      .run();
  }

  return {
    insert,
    getByMediaId,
    getAll,
    incrementPlayCount,
    updateLastPlayed,
    resetPlayCount,
    deleteByMediaId,
  };
}
