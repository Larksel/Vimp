import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const tags = sqliteTable(
  'tags',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    type: text('type', { enum: ['genre', 'custom'] }).notNull(),
  },
  (t) => [
    index('tags_type_idx').on(t.type),
    uniqueIndex('tags_name_type_uidx').on(t.name, t.type),
  ],
);
