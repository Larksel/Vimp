import { eq, sql } from 'drizzle-orm';
import type { DBQueryConfig } from 'drizzle-orm/relations';
import { InsertArtist, VimpDBExecutor, VimpRelations } from '@main/types';
import { artists } from '../schema/artists';

type ArtistFindOneConfig = DBQueryConfig<
  'one',
  VimpRelations,
  VimpRelations['artists']
>;
type ArtistFindManyConfig = DBQueryConfig<
  'many',
  VimpRelations,
  VimpRelations['artists']
>;

export default function createArtistRepository(db: VimpDBExecutor) {
  function insert(data: InsertArtist) {
    return db
      .insert(artists)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: artists.id })
      .get();
  }

  function getByName(name: string) {
    return db.select().from(artists).where(eq(artists.name, name)).get();
  }

  function getById<TConfig extends Omit<ArtistFindOneConfig, 'where'>>(
    id: number,
    config?: TConfig,
  ) {
    return db.query.artists.findFirst({ ...config, where: { id } });
  }

  function getAll<TConfig extends ArtistFindManyConfig>(config?: TConfig) {
    return db.query.artists.findMany(config);
  }

  function update(id: number, data: Partial<InsertArtist>) {
    return db.update(artists).set(data).where(eq(artists.id, id)).run();
  }

  function toggleFavorite(id: number) {
    return db
      .update(artists)
      .set({
        isFavorite: sql`NOT ${artists.isFavorite}`,
        favoritedAt: sql`CASE WHEN ${artists.isFavorite} THEN NULL ELSE (unixepoch('now') * 1000) END`,
      })
      .where(eq(artists.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(artists).where(eq(artists.id, id)).run();
  }

  return {
    insert,
    getById,
    getByName,
    getAll,
    update,
    toggleFavorite,
    deleteById,
  };
}
