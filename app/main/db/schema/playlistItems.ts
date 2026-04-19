import {
  index,
  integer,
  sqliteTable,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { playlists } from './playlists';
import { media } from './media';
import { sql } from 'drizzle-orm';

export const playlistItems = sqliteTable(
  'playlist_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    playlistId: integer('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    position: integer('position').notNull().default(0),
    addedAt: integer('added_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now') * 1000)`),
  },
  (t) => [
    index('playlist_items_playlist_idx').on(t.playlistId),
    index('playlist_items_media_idx').on(t.mediaId),
    index('playlist_items_playlist_position_idx').on(t.playlistId, t.position),
    uniqueIndex('playlist_items_playlist_media_uidx').on(
      t.playlistId,
      t.mediaId,
    ),
  ],
);
