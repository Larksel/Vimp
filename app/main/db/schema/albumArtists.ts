import {
  index,
  integer,
  primaryKey,
  sqliteTable,
} from 'drizzle-orm/sqlite-core';
import { albums } from './albums';
import { artists } from './artists';

export const albumArtists = sqliteTable(
  'album_artists',
  {
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
    artistId: integer('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.albumId, t.artistId] }),
    index('album_artists_artist_idx').on(t.artistId),
  ],
);
