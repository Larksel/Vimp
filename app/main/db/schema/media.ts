import {
  index,
  integer,
  real,
  sqliteTable,
  text,
} from 'drizzle-orm/sqlite-core';
import { externalSource, timestamps } from '../columns.helpers';

export const media = sqliteTable(
  'media',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    type: text('type', { enum: ['audio', 'video'] }).notNull(),
    title: text('title').notNull(),
    path: text('path').notNull().unique(),
    duration: real('duration'),

    coverPath: text('cover_path'),

    // Metadados de vídeo (null para áudio)
    resolutionW: integer('resolution_w'),
    resolutionH: integer('resolution_h'),
    codec: text('codec'),
    language: text('language'),

    isMissing: integer('is_missing', { mode: 'boolean' })
      .notNull()
      .default(false),

    ...externalSource,
    ...timestamps,
  },
  (t) => [
    index('media_type_idx').on(t.type),
    index('media_is_missing_idx').on(t.isMissing),
  ],
);
