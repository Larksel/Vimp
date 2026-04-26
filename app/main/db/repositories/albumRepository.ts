import { eq } from 'drizzle-orm';
import { InsertAlbum, VimpDB } from '@main/types';
import { albums } from '../schema/albums';

export default function createAlbumRepository(db: VimpDB) {
  function insert(
    title: string,
    coverPath?: string,
    externalId?: string,
    externalSource?: string,
  ) {
    const result = db
      .insert(albums)
      .values({ title, coverPath, externalId, externalSource })
      .onConflictDoNothing()
      .returning({ id: albums.id })
      .get();

    if (result) return result;

    return db
      .select({ id: albums.id })
      .from(albums)
      .where(eq(albums.title, title))
      .get();
  }

  function getById(id: number) {
    return db.select().from(albums).where(eq(albums.id, id)).get();
  }

  function getByTitle(title: string) {
    return db.select().from(albums).where(eq(albums.title, title)).get();
  }

  function getAll() {
    return db.select().from(albums).all();
  }

  function update(id: number, data: Partial<InsertAlbum>) {
    return db.update(albums).set(data).where(eq(albums.id, id)).run();
  }

  function deleteById(id: number) {
    return db.delete(albums).where(eq(albums.id, id)).run();
  }

  return {
    insert,
    getById,
    getByTitle,
    getAll,
    update,
    deleteById,
  };
}
