export type RepeatMode = 'off' | 'all' | 'one';

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
