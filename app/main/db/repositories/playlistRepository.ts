import { eq, sql } from 'drizzle-orm';
import type { DBQueryConfig } from 'drizzle-orm/relations';
import { InsertPlaylist, VimpDBExecutor, VimpRelations } from '@main/types';
import { playlists } from '../schema/playlists';

type PlaylistFindOneConfig = DBQueryConfig<
  'one',
  VimpRelations,
  VimpRelations['playlists']
>;
type PlaylistFindManyConfig = DBQueryConfig<
  'many',
  VimpRelations,
  VimpRelations['playlists']
>;

export default function createPlaylistRepository(db: VimpDBExecutor) {
  function insert(data: InsertPlaylist) {
    return db
      .insert(playlists)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: playlists.id })
      .get();
  }

  function getBySlug(slug: string) {
    return db.select().from(playlists).where(eq(playlists.slug, slug)).get();
  }

  function getById<TConfig extends Omit<PlaylistFindOneConfig, 'where'>>(
    id: number,
    config?: TConfig,
  ) {
    return db.query.playlists.findFirst({ ...config, where: { id } }).sync();
  }

  function getByIdSync(id: number) {
    return db.select().from(playlists).where(eq(playlists.id, id)).get();
  }

  function getAll<TConfig extends PlaylistFindManyConfig>(config?: TConfig) {
    return db.query.playlists.findMany(config).sync();
  }

  function getAllSync() {
    return db.select().from(playlists).all();
  }

  function getByType(type: 'audio' | 'video') {
    return db.select().from(playlists).where(eq(playlists.type, type)).all();
  }

  function getByKind(kind: 'normal' | 'smart' | 'system') {
    return db.select().from(playlists).where(eq(playlists.kind, kind)).all();
  }

  function toggleFavorite(id: number) {
    return db
      .update(playlists)
      .set({
        isFavorite: sql`NOT ${playlists.isFavorite}`,
        favoritedAt: sql`CASE WHEN ${playlists.isFavorite} THEN NULL ELSE (unixepoch('now') * 1000) END`,
      })
      .where(eq(playlists.id, id))
      .run();
  }

  function update(id: number, data: Partial<InsertPlaylist>) {
    return db
      .update(playlists)
      .set({ ...data, modifiedAt: new Date() })
      .where(eq(playlists.id, id))
      .run();
  }

  function deleteById(id: number) {
    return db.delete(playlists).where(eq(playlists.id, id)).run();
  }

  return {
    insert,
    getById,
    getByIdSync,
    getBySlug,
    getAll,
    getAllSync,
    getByType,
    getByKind,
    toggleFavorite,
    update,
    deleteById,
  };
}
