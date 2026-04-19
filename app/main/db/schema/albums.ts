import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { externalSource, timestamps } from '../columns.helpers';

export const albums = sqliteTable('albums', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  coverPath: text('cover_path'),
  ...externalSource,
  ...timestamps,
});
