import { eq } from 'drizzle-orm';
import { VimpDB, InsertMedia } from '@main/types';
import { media } from '../schema/media';

export default function createMediaRepository(db: VimpDB) {
  function insert(data: InsertMedia) {
    return db.insert(media).values(data).returning({ id: media.id }).get();
  }

  function getById(id: number) {
    return db.select().from(media).where(eq(media.id, id)).get();
  }

  function getByPath(path: string) {
    return db.select().from(media).where(eq(media.path, path)).get();
  }

  function getAll(type?: 'audio' | 'video') {
    const query = db.select().from(media);
    if (type) return query.where(eq(media.type, type)).all();
    return query.all();
  }

  function update(id: number, data: Partial<InsertMedia>) {
    return db.update(media).set(data).where(eq(media.id, id)).run();
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
    getByPath,
    getAll,
    update,
    markAsMissing,
    markAsFound,
    deleteById,
    deleteByPath,
  };
}
