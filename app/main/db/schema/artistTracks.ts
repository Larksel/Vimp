import { index, int, primaryKey, sqliteTable } from 'drizzle-orm/sqlite-core';
import { artists } from './artists';
import { tracks } from './tracks';

export const artistTracks = sqliteTable(
  'artist_tracks',
  {
    artistId: int('artist_id')
      .notNull()
      .references(() => artists.id, { onDelete: 'cascade' }),

    trackId: int('track_id')
      .notNull()
      .references(() => tracks.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.artistId, table.trackId] }),
    index('artist_tracks_track_idx').on(table.trackId),
  ],
);
