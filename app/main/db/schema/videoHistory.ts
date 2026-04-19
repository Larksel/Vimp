import { index, integer, real, sqliteTable } from 'drizzle-orm/sqlite-core';
import { media } from './media';

export const videoHistory = sqliteTable(
  'video_history',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    stoppedAt: real('stopped_at'),
    completed: integer('completed', { mode: 'boolean' }),
    playedAt: integer('played_at', { mode: 'timestamp_ms' }),
  },
  (t) => [
    index('video_history_media_idx').on(t.mediaId),
    index('video_history_played_at_idx').on(t.playedAt),
  ],
);
