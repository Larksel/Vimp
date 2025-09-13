export enum RepeatMode {
  OFF = 'off',
  ALL = 'all',
  ONE = 'one',
}

export enum PlayerStatus {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
}

export enum FileTypes {
  TRACKS = 'tracks',
  VIDEOS = 'videos',
  PLAYLIST = 'playlist',
  UNKNOWN = 'unknown',
}

export interface ScannedFiles {
  tracks: Track[];
  //videos: Video[];
}

/**
 * Generic info (dateAdded, playCount, favorite, etc.)
 */
export interface CommonData {
  playCount: number;
  favorite: boolean;
  dateFavorited?: Date;
  lastPlayed?: Date;
  dateAdded?: Date;
  dateModified?: Date;
  tags?: string[];
}

export interface Track extends CommonData {
  title: string;
  album?: string;
  artist: string | string[];
  genre: string | string[];
  duration: number;
  path: string;
  cover: string | null;
  albumartist?: string;
}

export interface Playlist extends CommonData {
  title: string;
  cover?: string;
  description?: string;
  totalDuration?: number;

  /**
   * Array with track IDs
   */
  tracks: string[];

  /**
   * Indicates whether the playlist is automatically generated based on criteria such as most played songs.
   */
  isDynamic: boolean;

  // Other attributes that may be useful later
  category?: 'Music' | 'Podcast' | 'Audiobook' | 'Other';
  privacy?: 'Public' | 'Private' | 'Unlisted';
}

export type GenericModel<T> = PouchDB.Core.ExistingDocument<
  T & PouchDB.Core.AllDocsMeta
>;

export type TrackModel = GenericModel<Track>;
export type PlaylistModel = GenericModel<Playlist>;

export interface Config {
  musicFolders: string[];
  displayNotifications: boolean;
  player: PlayerConfig
}

export interface PlayerConfig {
  audioVolume: number;
  audioPlaybackRate: number;
  audioMuted: boolean;
  audioShuffle: boolean;
  audioRepeatMode: RepeatMode;
  audioGaplessPlayback: boolean;
  audioCrossfadeDuration: number;
}

/**
 * Generic IPC channels for database methods
 */
export interface GenericDBChannels {
  GET_ALL: string;
  GET_BY_ID: string;
  CREATE: string;
  UPDATE: string;
  DELETE: string;
  CLEAR: string;
}
