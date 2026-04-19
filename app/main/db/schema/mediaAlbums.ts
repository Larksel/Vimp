import {
  index,
  integer,
  primaryKey,
  sqliteTable,
} from 'drizzle-orm/sqlite-core';
import { media } from './media';
import { albums } from './albums';

export const mediaAlbums = sqliteTable(
  'media_albums',
  {
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    albumId: integer('album_id')
      .notNull()
      .references(() => albums.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.albumId] }),
    index('media_albums_album_idx').on(t.albumId),
  ],
);
