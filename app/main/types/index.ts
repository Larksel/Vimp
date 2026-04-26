import { schema } from '@main/db/schema';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

export type VimpDB = BetterSQLite3Database<typeof schema>;

// Insert/Update types
export type InsertPlaylist = Omit<typeof schema.playlists.$inferInsert, 'id'>;
export type InsertPlaylistItem = Omit<
  typeof schema.playlistItems.$inferInsert,
  'id'
>;
export type InsertMedia = Omit<typeof schema.media.$inferInsert, 'id'>;
export type InsertAlbum = Omit<typeof schema.albums.$inferInsert, 'id'>;
export type InsertArtist = Omit<typeof schema.artists.$inferInsert, 'id'>;
export type InsertTag = Omit<typeof schema.tags.$inferInsert, 'id'>;
export type InsertAlbumArtist = typeof schema.albumArtists.$inferInsert;
export type InsertMediaAlbum = typeof schema.mediaAlbums.$inferInsert;
export type InsertMediaArtist = typeof schema.mediaArtists.$inferInsert;
export type InsertMediaTag = typeof schema.mediaTags.$inferInsert;
export type InsertAudioHistory = typeof schema.audioHistory.$inferInsert;
export type InsertVideoHistory = Omit<
  typeof schema.videoHistory.$inferInsert,
  'id'
>;
export type InsertWatchedFolder = Omit<
  typeof schema.watchedFolders.$inferInsert,
  'id'
>;

// Select types
export type Playlist = typeof schema.playlists.$inferSelect;
export type PlaylistItem = typeof schema.playlistItems.$inferSelect;
export type Media = typeof schema.media.$inferSelect;
export type Album = typeof schema.albums.$inferSelect;
export type Artist = typeof schema.artists.$inferSelect;
export type Tag = typeof schema.tags.$inferSelect;
export type AlbumArtist = typeof schema.albumArtists.$inferSelect;
export type MediaAlbum = typeof schema.mediaAlbums.$inferSelect;
export type MediaArtist = typeof schema.mediaArtists.$inferSelect;
export type MediaTag = typeof schema.mediaTags.$inferSelect;
export type AudioHistory = typeof schema.audioHistory.$inferSelect;
export type VideoHistory = typeof schema.videoHistory.$inferSelect;
export type WatchedFolder = typeof schema.watchedFolders.$inferSelect;
