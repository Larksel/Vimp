import { eq, and } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { tags } from '../schema/tags';

export default function createTagRepository(db: VimpDB) {
  function insert(name: string, type: 'genre' | 'custom' = 'custom') {
    return db
      .insert(tags)
      .values({ name, type })
      .onConflictDoNothing()
      .returning({ id: tags.id })
      .get();
  }

  function getById(id: number) {
    return db.select().from(tags).where(eq(tags.id, id)).get();
  }

  function getByNameAndType(name: string, type: 'genre' | 'custom') {
    return db
      .select()
      .from(tags)
      .where(and(eq(tags.name, name), eq(tags.type, type)))
      .get();
  }

  function getAll(type?: 'genre' | 'custom') {
    const query = db.select().from(tags);
    if (type) return query.where(eq(tags.type, type)).all();
    return query.all();
  }

  function update(id: number, name: string) {
    return db.update(tags).set({ name }).where(eq(tags.id, id)).run();
  }

  function deleteById(id: number) {
    return db.delete(tags).where(eq(tags.id, id)).run();
  }

  return {
    insert,
    getById,
    getByNameAndType,
    getAll,
    update,
    deleteById,
  };
}