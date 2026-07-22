import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { externalSource, favoritable, timestamps } from './columns.helpers';

export const artists = sqliteTable(
  'artists',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull().unique(),
    coverPath: text('cover_path'),
    ...favoritable,
    ...externalSource,
    ...timestamps,
  },
  (t) => [
    index('artists_name_idx').on(t.name),
    index('artists_is_favorite_idx').on(t.isFavorite),
  ],
);
