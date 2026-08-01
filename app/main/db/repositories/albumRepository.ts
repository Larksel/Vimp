import { eq, sql } from 'drizzle-orm';
import type { DBQueryConfig } from 'drizzle-orm/relations';
import { InsertAlbum, VimpDBExecutor, VimpRelations } from '@main/types';
import { albums } from '../schema/albums';

type AlbumFindOneConfig = DBQueryConfig<
  'one',
  VimpRelations,
  VimpRelations['albums']
>;
type AlbumFindManyConfig = DBQueryConfig<
  'many',
  VimpRelations,
  VimpRelations['albums']
>;

export default function createAlbumRepository(db: VimpDBExecutor) {
  function insert(data: InsertAlbum) {
    return db
      .insert(albums)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: albums.id })
      .get();
  }

  function getByTitle(title: string) {
    return db.select().from(albums).where(eq(albums.title, title)).get();
  }

  function getById<TConfig extends Omit<AlbumFindOneConfig, 'where'>>(
    id: number,
    config?: TConfig,
  ) {
    return db.query.albums.findFirst({ ...config, where: { id } });
  }

  function getAll<TConfig extends AlbumFindManyConfig>(config?: TConfig) {
    return db.query.albums.findMany(config);
  }

  function toggleFavorite(id: number) {
    return db
      .update(albums)
      .set({
        isFavorite: sql`NOT ${albums.isFavorite}`,
        favoritedAt: sql`CASE WHEN ${albums.isFavorite} THEN NULL ELSE (unixepoch('now') * 1000) END`,
      })
      .where(eq(albums.id, id))
      .run();
  }

  function update(id: number, data: Partial<InsertAlbum>) {
    return db
      .update(albums)
      .set({ ...data, modifiedAt: new Date() })
      .where(eq(albums.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(albums).where(eq(albums.id, id)).run();
  }

  return {
    insert,
    getById,
    getByTitle,
    getAll,
    toggleFavorite,
    update,
    deleteById,
  };
}
