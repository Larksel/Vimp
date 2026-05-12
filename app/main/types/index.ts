import { schema } from '@main/db/schema';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

export type VimpDatabase = BetterSQLite3Database<typeof schema>;

// Insert/Update types
export type InsertPlaylist = typeof schema.playlists.$inferInsert;
export type InsertPlaylistItem = typeof schema.playlistItems.$inferInsert;
export type InsertMedia = typeof schema.media.$inferInsert;
export type InsertAlbum = typeof schema.albums.$inferInsert;
export type InsertArtist = typeof schema.artists.$inferInsert;
export type InsertTag = typeof schema.tags.$inferInsert;
export type InsertAlbumArtist = typeof schema.albumArtists.$inferInsert;
export type InsertMediaAlbum = typeof schema.mediaAlbums.$inferInsert;
export type InsertMediaArtist = typeof schema.mediaArtists.$inferInsert;
export type InsertMediaTag = typeof schema.mediaTags.$inferInsert;
export type InsertAudioHistory = typeof schema.audioHistory.$inferInsert;
export type InsertVideoHistory = typeof schema.videoHistory.$inferInsert;
export type InsertWatchedFolder = typeof schema.watchedFolders.$inferInsert;

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
