import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { media } from './media';

export const audioHistory = sqliteTable('audio_history', {
  mediaId: integer('media_id')
    .primaryKey()
    .references(() => media.id, { onDelete: 'cascade' }),
  playCount: integer('play_count').notNull().default(0),
  lastPlayedAt: integer('last_played_at', { mode: 'timestamp_ms' }),
});
