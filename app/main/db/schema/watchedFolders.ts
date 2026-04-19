import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from '../columns.helpers';

export const watchedFolders = sqliteTable('watched_folders', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  lastScannedAt: integer('last_scanned_at', { mode: 'timestamp_ms' }),
  ...timestamps,
});
