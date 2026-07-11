import { index, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { media } from './media';
import { sql } from 'drizzle-orm';

export const videoHistory = sqliteTable(
  'video_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    stoppedAt: real('stopped_at'),
    completed: integer('completed', { mode: 'boolean' }),
    playedAt: integer('played_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch('now') * 1000)`),
  },
  (t) => [
    index('video_history_media_idx').on(t.mediaId),
    index('video_history_played_at_idx').on(t.playedAt),
  ],
);
