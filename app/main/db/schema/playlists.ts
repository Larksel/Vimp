import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { favoritable, timestamps } from '../columns.helpers';

export const playlists = sqliteTable(
  'playlists',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    cover: text('cover'),
    description: text('description'),
    ...favoritable,
    ...timestamps,
  },
  (table) => [
    index('playlists_title_idx').on(table.title),
    index('playlists_favorite_idx').on(table.favorite),
  ],
);
