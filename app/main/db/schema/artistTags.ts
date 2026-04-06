import { int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { artists } from './artists';
import { tags } from './tags';

export const artistTags = sqliteTable(
  'artist_tags',
  {
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    artistId: int('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.tagId, table.artistId] })],
);
