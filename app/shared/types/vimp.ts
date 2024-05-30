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

export interface Track {
  title: string;
  album: string | undefined;
  artist: string[];
  genre: string[];
  duration: number | undefined;
  playCount: number;
  favorite: boolean;
  lastPlayed: string | null;
  path: string;
  cover: string;
}

export type TrackModel = PouchDB.Core.ExistingDocument<
  Track & PouchDB.Core.AllDocsMeta
>;
