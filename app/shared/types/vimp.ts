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

/**
 * Informações genéricas (dateAdded, playCount, favorite, etc.)
 */
export interface CommonData {
  playCount: number;
  favorite: boolean;
  lastPlayed?: Date;
  dateAdded?: Date;
  dateModified?: Date;
}

export interface Track extends CommonData {
  title: string;
  album?: string;
  artist: string | string[];
  genre: string | string[];
  duration?: number;
  path: string;
  cover: string;
  albumartist?: string;
}

export type TrackModel = PouchDB.Core.ExistingDocument<
  Track & PouchDB.Core.AllDocsMeta
>;

export interface Config {
  audioVolume: number,
  audioPlaybackRate: number,
  audioMuted: boolean,
  audioShuffle: boolean,
  audioRepeatMode: RepeatMode,
  audioGaplessPlayback: boolean,
  audioCrossfadeDuration: number,
  musicFolders: string[],

  displayNotifications: boolean,
}