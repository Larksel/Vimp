import { int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { playlists } from './playlists';
import { tags } from './tags';

export const playlistTags = sqliteTable(
  'playlist_tags',
  {
    tagId: int('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    playlistId: int('playlist_id')
      .notNull()
      .references(() => playlists.id, { onDelete: 'cascade' }),
  },
  (table) => [primaryKey({ columns: [table.tagId, table.playlistId] })],
);
