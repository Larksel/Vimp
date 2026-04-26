import { eq } from 'drizzle-orm';
import { VimpDB } from '@main/types';
import { watchedFolders } from '../schema/watchedFolders';

export default function createWatchedFolderRepository(db: VimpDB) {
  function insert(path: string) {
    return db
      .insert(watchedFolders)
      .values({ path })
      .onConflictDoNothing()
      .returning({ id: watchedFolders.id })
      .get();
  }

  function getById(id: number) {
    return db
      .select()
      .from(watchedFolders)
      .where(eq(watchedFolders.id, id))
      .get();
  }

  function getByPath(path: string) {
    return db
      .select()
      .from(watchedFolders)
      .where(eq(watchedFolders.path, path))
      .get();
  }

  function getAll() {
    return db.select().from(watchedFolders).all();
  }

  function updateLastScanned(id: number) {
    return db
      .update(watchedFolders)
      .set({ lastScannedAt: new Date() })
      .where(eq(watchedFolders.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(watchedFolders).where(eq(watchedFolders.id, id)).run();
  }

  function deleteByPath(path: string) {
    return db.delete(watchedFolders).where(eq(watchedFolders.path, path)).run();
  }

  return {
    insert,
    getById,
    getByPath,
    getAll,
    updateLastScanned,
    deleteById,
    deleteByPath,
  };
}
