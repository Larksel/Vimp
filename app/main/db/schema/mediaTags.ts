import {
  index,
  integer,
  primaryKey,
  sqliteTable,
} from 'drizzle-orm/sqlite-core';
import { media } from './media';
import { tags } from './tags';

export const mediaTags = sqliteTable(
  'media_tags',
  {
    mediaId: integer('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [
    primaryKey({ columns: [t.mediaId, t.tagId] }),
    index('media_tags_tag_idx').on(t.tagId),
  ],
);
