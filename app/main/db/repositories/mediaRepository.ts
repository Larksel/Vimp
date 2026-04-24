import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import { eq, sql } from 'drizzle-orm';
import fs from 'fs';
import { schema } from '../schema';
import { Track } from '@shared/types/vimp';
import { media } from '../schema/media';
import { artists } from '../schema/artists';
import { mediaArtists } from '../schema/mediaArtists';
import { albums } from '../schema/albums';
import { mediaAlbums } from '../schema/mediaAlbums';
import { tags } from '../schema/tags';
import { mediaTags } from '../schema/mediaTags';
import { audioHistory } from '../schema/audioHistory';
import { playlists } from '../schema/playlists';
import { playlistItems } from '../schema/playlistItems';

type DB = BetterSQLite3Database<typeof schema>;

export const mediaRepository = {
  insert,
  getById,
  getByPath,
  getAll,
  scanForMissing,
  markAsMissing,
  markAsFound,
  toggleFavorite,
  incrementPlayCount,
  deleteByPath,
  deleteById,
};

// TODO Somente adiciona mídia do tipo áudio. Criar separação.
function insert(db: DB, track: Track) {
  return db.transaction((tx) => {
    const inserted = tx
      .insert(media)
      .values({
        type: 'audio',
        title: track.title,
        path: track.path,
        duration: track.duration,
        coverPath: track.cover,
        isMissing: false,
        modifiedAt: track.dateModified,
      })
      .returning({ id: media.id })
      .get();

    const mediaId = inserted.id;

    // Artistas
    const artistNames = Array.isArray(track.artist)
      ? track.artist
      : [track.artist];

    for (const name of artistNames) {
      const artist =
        tx
          .insert(artists)
          .values({ name })
          .onConflictDoNothing()
          .returning({ id: artists.id })
          .get() ??
        tx
          .select({ id: artists.id })
          .from(artists)
          .where(eq(artists.name, name))
          .get();

      if (artist) {
        tx.insert(mediaArtists)
          .values({ mediaId, artistId: artist.id })
          .onConflictDoNothing()
          .run();
      }
    }

    // Álbum
    if (track.album) {
      const album =
        tx
          .insert(albums)
          .values({ title: track.album })
          .onConflictDoNothing()
          .returning({ id: albums.id })
          .get() ??
        tx
          .select({ id: albums.id })
          .from(albums)
          .where(eq(albums.title, track.album))
          .get();

      if (album) {
        tx.insert(mediaAlbums)
          .values({ mediaId, albumId: album.id })
          .onConflictDoNothing()
          .run();
      }
    }

    // Gêneros
    const genres = Array.isArray(track.genre) ? track.genre : [track.genre];

    for (const name of genres) {
      const genre =
        tx
          .insert(tags)
          .values({ name, type: 'genre' })
          .onConflictDoNothing()
          .returning({ id: tags.id })
          .get() ??
        tx.select({ id: tags.id }).from(tags).where(eq(tags.name, name)).get();

      if (genre) {
        tx.insert(mediaTags)
          .values({ mediaId, tagId: genre.id })
          .onConflictDoNothing()
          .run();
      }
    }

    // Histórico de áudio
    tx.insert(audioHistory)
      .values({ mediaId, playCount: 0 })
      .onConflictDoNothing()
      .run();

    return mediaId;
  });
}

// Leitura

function getById(db: DB, id: number) {
  return db.select().from(media).where(eq(media.id, id)).get();
}

function getByPath(db: DB, filePath: string) {
  return db.select().from(media).where(eq(media.path, filePath)).get();
}

function getAll(db: DB, type?: 'audio' | 'video') {
  const query = db.select().from(media);
  if (type) return query.where(eq(media.type, type)).all();
  return query.all();
}

// Verificação

function scanForMissing(db: DB) {
  const allMedia = db
    .select({ id: media.id, path: media.path })
    .from(media)
    .where(eq(media.isMissing, false))
    .all();

  const missingIds: number[] = [];

  for (const item of allMedia) {
    if (!fs.existsSync(item.path)) {
      db.update(media)
        .set({ isMissing: true, modifiedAt: new Date() })
        .where(eq(media.id, item.id))
        .run();

      missingIds.push(item.id);
    }
  }

  return missingIds;
}

function markAsMissing(db: DB, id: number) {
  return db
    .update(media)
    .set({ isMissing: true, modifiedAt: new Date() })
    .where(eq(media.id, id))
    .run();
}

function markAsFound(db: DB, id: number) {
  return db
    .update(media)
    .set({ isMissing: false, modifiedAt: new Date() })
    .where(eq(media.id, id))
    .run();
}

// Favorito

function toggleFavorite(db: DB, mediaId: number) {
  return db.transaction((tx) => {
    const favoritesPlaylist = tx
      .select({ id: playlists.id })
      .from(playlists)
      .where(eq(playlists.slug, 'system.favorites'))
      .get();

    if (!favoritesPlaylist) {
      throw new Error('Favorites playlist not found');
    }

    const playlistId = favoritesPlaylist.id;

    const playlistItem = tx
      .select({ id: playlistItems.id })
      .from(playlistItems)
      .where(eq(playlistItems.mediaId, mediaId))
      .get();

    if (playlistItem) {
      tx.delete(playlistItems)
        .where(eq(playlistItems.id, playlistItem.id))
        .run();
      return false; // removido dos favoritos
    }

    tx.insert(playlistItems).values({ playlistId, mediaId, position: 0 }).run();
    return true; // adicionado aos favoritos
  });
}

// Histórico

function incrementPlayCount(db: DB, mediaId: number) {
  return db
    .update(audioHistory)
    .set({
      playCount: sql`${audioHistory.playCount} + 1`,
      lastPlayedAt: new Date(),
    })
    .where(eq(audioHistory.mediaId, mediaId))
    .run();
}

// Remoção

function deleteByPath(db: DB, filePath: string) {
  return db.delete(media).where(eq(media.path, filePath)).run();
}

function deleteById(db: DB, id: number) {
  return db.delete(media).where(eq(media.id, id)).run();
}
