import { Playlist, Track } from '@shared/types/vimp';

/**
 * Returns the passed date with the timezone offset applied
 */
export const formatDate = (date: Date | undefined) => {
  if (date === undefined) return null;

  const dateObj = new Date(date);
  const offsetMinutos = dateObj.getTimezoneOffset();
  const milissegundos = offsetMinutos * 60 * 1000;
  const data = new Date(dateObj.getTime() - milissegundos);

  return data.toISOString();
};

/**
 * Returns a generic playlist object
 */
export const createGenericPlaylist = (): Playlist => {
  return {
    title: 'Generic Playlist',
    favorite: false,
    isDynamic: false,
    playCount: 0,
    tracks: [],
    dateAdded: new Date(),
  };
};

/**
 * Returns a generic track object
 */
export const createGenericTrack = (): Track => {
  return {
    title: 'Generic Track',
    artist: 'Unknown artist',
    duration: 0,
    favorite: false,
    playCount: 0,
    dateAdded: new Date(),
    genre: 'Unknown genre',
    cover: '',
    path: '',
  };
};
