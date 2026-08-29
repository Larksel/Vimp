// ---- Enums ----

export enum MediaType {
  AUDIO = 'audio',
  VIDEO = 'video',
}

export enum PlaylistKind {
  NORMAL = 'normal',
  SMART = 'smart',
  SYSTEM = 'system',
}

export enum PlaylistSortMode {
  MANUAL = 'manual',
  TITLE = 'title',
  ARTIST = 'artist',
  ADDED_AT = 'added_at',
}

export enum TagType {
  GENRE = 'genre',
  CUSTOM = 'custom',
}

// ---- Interfaces base ----

interface Timestamps {
  createdAt: Date;
  modifiedAt: Date;
}

interface ExternalSource {
  externalId?: string | null;
  externalSource?: string | null;
}

interface Favoritable {
  isFavorite: boolean;
  favoritedAt?: Date | null;
}

// ---- Entidades principais ----

export interface Media extends Timestamps, ExternalSource, Favoritable {
  id: number;
  type: MediaType;
  title: string;
  path: string;
  duration?: number | null;
  coverPath?: string | null;
  resolutionW?: number | null;
  resolutionH?: number | null;
  codec?: string | null;
  language?: string | null;
  isMissing: boolean;
}

export interface Playlist extends Timestamps, Favoritable {
  id: number;
  name: string;
  cover?: string | null;
  type: MediaType;
  kind: PlaylistKind;
  sortMode: PlaylistSortMode;
  filters?: Record<string, unknown> | null;
  slug?: string | null;
}

export interface Album extends Timestamps, ExternalSource, Favoritable {
  id: number;
  title: string;
  coverPath?: string | null;
}

export interface Artist extends Timestamps, ExternalSource, Favoritable {
  id: number;
  name: string;
  coverPath?: string | null;
}

export interface Tag {
  id: number;
  name: string;
  type: TagType;
}

export interface WatchedFolder {
  id: number;
  path: string;
  lastScannedAt?: Date | null;
}

// ---- Tabelas de junção ----

export interface AlbumArtist {
  albumId: number;
  artistId: number;
}

export interface MediaAlbum {
  mediaId: number;
  albumId: number;
}

export interface MediaArtist {
  mediaId: number;
  artistId: number;
}

export interface MediaTag {
  mediaId: number;
  tagId: number;
}

export interface PlaylistItem {
  id: number;
  playlistId: number;
  mediaId: number;
  position: number;
  addedAt: Date;
}

// ---- Históricos ----

export interface AudioHistory {
  mediaId: number;
  playCount: number;
  lastPlayedAt: Date;
}

export interface VideoHistory {
  id: number;
  mediaId: number;
  stoppedAt?: number | null;
  completed?: boolean | null;
  playedAt: Date;
}

// ---- Tipos agregados (usados pelo renderer) ----

// TODO implementar relação com históricos
export interface AudioItem extends Media {
  type: MediaType.AUDIO;
  artists: { name: string }[];
  albums: { title: string }[];
  playlists: { id: number; name: string }[];
  tags: { id: number; name: string; type: TagType }[];
  audioHistoryEntry: {
    playCount: number;
    lastPlayedAt: Date;
  };
  videoHistoryEntries: {
    completed: boolean;
    stoppedAt: number;
    playedAt: Date;
  }[];
}

export interface VideoItem extends Media {
  type: MediaType.VIDEO;
  lastPlayedAt?: Date | null;
}

export interface PlaylistWithItems extends Playlist {
  items: PlaylistItemWithMedia[];
}

export interface PlaylistItemWithMedia extends PlaylistItem {
  media: Media;
}
