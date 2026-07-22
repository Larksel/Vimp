import { sql } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';

export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now') * 1000)`),
  modifiedAt: integer('modified_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(sql`(unixepoch('now') * 1000)`),
};

export const externalSource = {
  externalId: text('external_id'),
  externalSource: text('external_source'),
};

export const favoritable = {
  isFavorite: integer('is_favorite', { mode: 'boolean' })
    .notNull()
    .default(false),
  favoritedAt: integer('favorited_at', { mode: 'timestamp_ms' }),
};
