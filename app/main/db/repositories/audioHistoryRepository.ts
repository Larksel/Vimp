import { eq, sql } from 'drizzle-orm';
import type { DBQueryConfig } from 'drizzle-orm/relations';
import { InsertAudioHistory, VimpDBExecutor, VimpRelations } from '@main/types';
import { audioHistory } from '../schema/audioHistory';

type AudioHistoryFindOneConfig = DBQueryConfig<
  'one',
  VimpRelations,
  VimpRelations['audioHistory']
>;
type AudioHistoryFindManyConfig = DBQueryConfig<
  'many',
  VimpRelations,
  VimpRelations['audioHistory']
>;

export default function createAudioHistoryRepository(db: VimpDBExecutor) {
  function insert(data: InsertAudioHistory) {
    return db.insert(audioHistory).values(data).onConflictDoNothing().run();
  }

  function getByMediaId<
    TConfig extends Omit<AudioHistoryFindOneConfig, 'where'>,
  >(mediaId: number, config?: TConfig) {
    return db.query.audioHistory.findFirst({ ...config, where: { mediaId } });
  }

  function getAll<TConfig extends AudioHistoryFindManyConfig>(
    config?: TConfig,
  ) {
    return db.query.audioHistory.findMany(config);
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
