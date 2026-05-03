import { eq } from 'drizzle-orm';
import { InsertArtist, VimpDB } from '@main/types';
import { artists } from '../schema/artists';

export default function createArtistRepository(db: VimpDB) {
  function insert(data: InsertArtist) {
    return db
      .insert(artists)
      .values(data)
      .onConflictDoNothing()
      .returning({ id: artists.id })
      .get();
  }

  function getById(id: number) {
    return db.select().from(artists).where(eq(artists.id, id)).get();
  }

  function getByName(name: string) {
    return db.select().from(artists).where(eq(artists.name, name)).get();
  }

  function getAll() {
    return db.select().from(artists).all();
  }

  function getFavorites() {
    return db.select().from(artists).where(eq(artists.isFavorite, true)).all();
  }

  function update(id: number, data: Partial<InsertArtist>) {
    return db.update(artists).set(data).where(eq(artists.id, id)).run();
  }

  function toggleFavorite(id: number) {
    return db.transaction((tx) => {
      const artist = tx.select().from(artists).where(eq(artists.id, id)).get();

      if (!artist) return null;

      const newFavoriteState = !artist.isFavorite;

      tx.update(artists)
        .set({
          isFavorite: newFavoriteState,
          favoritedAt: newFavoriteState ? new Date() : null,
        })
        .where(eq(artists.id, id))
        .run();

      return newFavoriteState;
    });
  }

  function deleteById(id: number) {
    return db.delete(artists).where(eq(artists.id, id)).run();
  }

  return {
    insert,
    getById,
    getByName,
    getAll,
    getFavorites,
    update,
    toggleFavorite,
    deleteById,
  };
}
