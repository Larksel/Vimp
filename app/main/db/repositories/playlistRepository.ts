import { InsertPlaylist, VimpDB } from '@main/types';
import { playlists } from '../schema/playlists';
import { eq } from 'drizzle-orm';

export default function createPlaylistRepository(db: VimpDB) {
  function insert(data: InsertPlaylist) {
    return db
      .insert(playlists)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: playlists.id })
      .get();
  }

  function getById(id: number) {
    return db.select().from(playlists).where(eq(playlists.id, id)).get();
  }

  function getBySlug(slug: string) {
    return db.select().from(playlists).where(eq(playlists.slug, slug)).get();
  }

  function getAll() {
    return db.select().from(playlists).all();
  }

  function getByType(type: 'audio' | 'video') {
    return db.select().from(playlists).where(eq(playlists.type, type)).all();
  }

  function getByKind(kind: 'normal' | 'smart' | 'system') {
    return db.select().from(playlists).where(eq(playlists.kind, kind)).all();
  }

  function update(id: number, data: Partial<InsertPlaylist>) {
    return db.update(playlists).set(data).where(eq(playlists.id, id)).run();
  }

  function deleteById(id: number) {
    return db.delete(playlists).where(eq(playlists.id, id)).run();
  }

  return {
    insert,
    getById,
    getBySlug,
    getAll,
    getByType,
    getByKind,
    update,
    deleteById,
  };
}
