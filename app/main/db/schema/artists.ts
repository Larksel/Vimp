import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { favoritable, timestamps } from '../columns.helpers';

export const artists = sqliteTable(
  'artists',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    ...favoritable,
    ...timestamps,
  },
  (table) => [
    index('artists_name_idx').on(table.name),
    index('artists_favorite_idx').on(table.favorite),
  ],
);
