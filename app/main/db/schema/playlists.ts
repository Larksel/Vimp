import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { favoritable, timestamps } from './columns.helpers';

export const playlists = sqliteTable(
  'playlists',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    cover: text('cover'),
    type: text('type', { enum: ['audio', 'video'] }).notNull(),
    kind: text('kind', { enum: ['normal', 'smart', 'system'] })
      .notNull()
      .default('normal'),
    sortMode: text('sort_mode', {
      enum: ['manual', 'title', 'artist', 'added_at'],
    })
      .notNull()
      .default('added_at'),
    filters: text('filters', { mode: 'json' }).$type<Record<string, unknown>>(),
    slug: text('slug').unique(),
    ...favoritable,
    ...timestamps,
  },
  (t) => [index('playlist_is_favorite_idx').on(t.isFavorite)],
);
