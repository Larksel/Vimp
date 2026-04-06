import { int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { tracks } from './tracks';
import { tags } from './tags';

export const trackTags = sqliteTable(
  'track_tags',
  {
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    trackId: int('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.tagId, table.trackId] })],
);
