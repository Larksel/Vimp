import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { media } from './media';
import { sql } from 'drizzle-orm';

export const audioHistory = sqliteTable('audio_history', {
  mediaId: integer('media_id')
    .primaryKey()
    .references(() => media.id, { onDelete: 'cascade' }),
  playCount: integer('play_count').notNull().default(0),
  lastPlayedAt: integer('last_played_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now') * 1000)`),
});
