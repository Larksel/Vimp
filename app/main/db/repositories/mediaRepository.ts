import { eq, sql } from 'drizzle-orm';
import type { DBQueryConfig } from 'drizzle-orm/relations';
import { InsertMedia, VimpDBExecutor, VimpRelations } from '@main/types';
import { media } from '../schema/media';

type MediaFindOneConfig = DBQueryConfig<
  'one',
  VimpRelations,
  VimpRelations['media']
>;
type MediaFindManyConfig = DBQueryConfig<
  'many',
  VimpRelations,
  VimpRelations['media']
>;

export default function createMediaRepository(db: VimpDBExecutor) {
  function insert(data: InsertMedia) {
    return db.insert(media).values(data).returning({ id: media.id }).get();
  }

  function getByPath(path: string) {
    return db.select().from(media).where(eq(media.path, path)).get();
  }

  function getByType(type?: 'audio' | 'video') {
    const query = db.select().from(media);
    if (type) return query.where(eq(media.type, type)).all();
    return query.all();
  }

  function getById<TConfig extends Omit<MediaFindOneConfig, 'where'>>(
    id: number,
    config?: TConfig,
  ) {
    return db.query.media.findFirst({ ...config, where: { id } });
  }

  function getByIdSync(id: number) {
    return db.select().from(media).where(eq(media.id, id)).get();
  }

  function getAllSync() {
    return db.select().from(media).all();
  }

  function getAll<TConfig extends MediaFindManyConfig>(config?: TConfig) {
    return db.query.media.findMany(config);
  }

  function update(id: number, data: Partial<InsertMedia>) {
    return db
      .update(media)
      .set({ ...data, modifiedAt: new Date() })
      .where(eq(media.id, id))
      .run();
  }

  function toggleFavorite(id: number) {
    return db
      .update(media)
      .set({
        isFavorite: sql`NOT ${media.isFavorite}`,
        favoritedAt: sql`CASE WHEN ${media.isFavorite} THEN NULL ELSE (unixepoch('now') * 1000) END`,
      })
      .where(eq(media.id, id))
      .run();
  }

  function markAsMissing(id: number) {
    return db
      .update(media)
      .set({ isMissing: true })
      .where(eq(media.id, id))
      .run();
  }

  function markAsFound(id: number) {
    return db
      .update(media)
      .set({ isMissing: false })
      .where(eq(media.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(media).where(eq(media.id, id)).run();
  }

  function deleteByPath(path: string) {
    return db.delete(media).where(eq(media.path, path)).run();
  }

  return {
    insert,
    getById,
    getByIdSync,
    getByPath,
    getAll,
    getAllSync,
    getByType,
    toggleFavorite,
    update,
    markAsMissing,
    markAsFound,
    deleteById,
    deleteByPath,
  };
}
