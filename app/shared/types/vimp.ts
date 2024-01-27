export type RepeatMode = 'off' | 'all' | 'one';

export interface Track {
  title: string;
  album: string;
  artist: string[];
  genre: string[];
  duration: number;
  playCount: number;
  favorite: boolean;
  lastPlayed: Date;
  path: string;
}

export type TrackModel = PouchDB.Core.ExistingDocument<
  Track & PouchDB.Core.AllDocsMeta
>;