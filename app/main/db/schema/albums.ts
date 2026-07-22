import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { externalSource, favoritable, timestamps } from './columns.helpers';

export const albums = sqliteTable(
  'albums',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull().unique(),
    coverPath: text('cover_path'),
    ...favoritable,
    ...externalSource,
    ...timestamps,
  },
  (t) => [index('album_is_favorite_idx').on(t.isFavorite)],
);
