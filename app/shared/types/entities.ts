// Históricos

export interface AudioHistory {
  mediaId: number;
  playCount: number;
  lastPlayedAt: Date;
}

export interface VideoHistory {
  id: number;
  mediaId: number;
  stoppedAt?: number;
  completed?: boolean;
  playedAt: Date;
}

// Entidades principais

export interface Media extends Timestamps, ExternalSource {
  id: number;
  type: MediaType;
  title: string;
  path: string;
  duration?: number;

  coverPath?: string;

  // Metadados de vídeo (null para áudio)
  resolutionW?: number;
  resolutionH?: number;
  codec?: string;
  language?: string;

  isMissing: boolean;
}

export interface Playlists extends Timestamps {
  id: number;
  name: string;
  cover?: string;
  type: MediaType;
  kind: PlaylistKind;
  sortMode: PlaylistSortMode;
  filters?: string;
  slug?: string;
}

export interface Albums extends Timestamps, ExternalSource {
  id: number;
  title: string;
  coverPath?: string;
}

export interface Artists extends Timestamps, ExternalSource {
  id: number;
  name: string;
  coverPath?: string;
  isFavorite: boolean;
  favoritedAt?: Date;
}

export interface Tags {
  id: number;
  name: string;
  type: TagType;
}

export interface WatchedFolders {
  id: number;
  path: string;
  lastScannedAt?: Date;
}

// Agregações

export interface AlbumArtists {
  albumId: number;
  artistId: number;
}

export interface MediaAlbums {
  mediaId: number;
  albumId: number;
}

export interface MediaArtists {
  mediaId: number;
  artistId: number;
}

export interface MediaTags {
  mediaId: number;
  tagId: number;
}

export interface PlaylistItems {
  id: number;
  playlistId: number;
  mediaId: number;
  position: number;
  addedAt: Date;
}

// Misc
enum TagType {
  GENRE = 'genre',
  CUSTOM = 'custom',
}

enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

enum PlaylistKind {
  NORMAL = 'normal',
  SMART = 'smart',
  SYSTEM = 'system',
}

enum PlaylistSortMode {
  MANUAL = 'manual',
  TITLE = 'title',
  ARTIST = 'artist',
  ADDED_AT = 'added_at',
}

interface Timestamps {
  createdAt: Date;
  modifiedAt: Date;
}

interface ExternalSource {
  externalId?: string;
  externalSource?: string;
}
