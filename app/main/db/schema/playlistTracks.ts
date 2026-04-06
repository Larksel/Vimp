import { sql } from 'drizzle-orm';
import {
  index,
  int,
  primaryKey,
  sqliteTable,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { playlists } from './playlists';
import { tracks } from './tracks';

export const playlistTracks = sqliteTable(
  'playlist_tracks',
  {
    playlistId: int('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),

    trackId: int('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),

    position: int('position').notNull(),

    addedAt: int('added_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    primaryKey({ columns: [table.playlistId, table.trackId] }),
    index('playlist_tracks_track_idx').on(table.trackId),
    uniqueIndex('playlist_tracks_playlist_order_idx').on(
      table.playlistId,
      table.position,
    ),
  ],
);
