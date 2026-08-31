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
    return db.query.audioHistory
      .findFirst({ ...config, where: { mediaId } })
      .sync();
  }

  function getAll<TConfig extends AudioHistoryFindManyConfig>(
    config?: TConfig,
  ) {
    return db.query.audioHistory.findMany(config).sync();
  }

  function incrementPlayCount(mediaId: number) {
    const lastPlayedAt = new Date();

    return db
      .insert(audioHistory)
      .values({
        mediaId,
        playCount: 1,
        lastPlayedAt,
      })
      .onConflictDoUpdate({
        target: audioHistory.mediaId,
        set: {
          playCount: sql`${audioHistory.playCount} + 1`,
          lastPlayedAt,
        },
      })
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
    deleteByMediaId,
  };
}
