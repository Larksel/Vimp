export type RepeatMode = 'off' | 'all' | 'one';

export interface Track {
  album: string,
  artist: string,
  duration: number,
  genre: string,
  path: string,
  playCount: number,
  title: string,
  year: number,
}