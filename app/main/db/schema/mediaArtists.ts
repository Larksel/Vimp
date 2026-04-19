import {
  index,
  integer,
  primaryKey,
  sqliteTable,
} from 'drizzle-orm/sqlite-core';
import { media } from './media';
import { artists } from './artists';

export const mediaArtists = sqliteTable(
  'media_artists',
  {
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    artistId: integer('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.artistId] }),
    index('media_artists_artist_idx').on(t.artistId),
  ],
);
