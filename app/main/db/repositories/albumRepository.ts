import { eq } from 'drizzle-orm';
import { InsertAlbum, VimpDB } from '@main/types';
import { albums } from '../schema/albums';

export default function createAlbumRepository(db: VimpDB) {
  function insert(data: InsertAlbum) {
    return db
      .insert(albums)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: albums.id })
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
