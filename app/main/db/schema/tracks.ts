import {
  index,
  int,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';
import { favoritable, timestamps } from '../columns.helpers';

export const tracks = sqliteTable(
  'tracks',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    duration: int('duration').notNull(),
    path: text('path').notNull(),
    cover: text('cover'),
    playCount: int('play_count').notNull().default(0),
    lastPlayed: int('last_played', { mode: 'timestamp_ms' }),
    dateModified: int('date_modified', { mode: 'timestamp_ms' }),
    ...favoritable,
    ...timestamps,
  },
  (table) => [
    uniqueIndex('tracks_path_unique_idx').on(table.path),
    index('tracks_title_idx').on(table.title),
    index('tracks_play_count_idx').on(table.playCount),
    index('tracks_favorite_idx').on(table.favorite),
    index('tracks_last_played_idx').on(table.lastPlayed),
  ],
);
