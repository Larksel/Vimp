import { index, int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { timestamps } from '../columns.helpers';

export const tags = sqliteTable(
  'tags',
  {
    id: int('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    ...timestamps,
  },
  (table) => [index('tags_name_idx').on(table.name)],
);
