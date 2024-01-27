import * as mmd from 'music-metadata';
import path from 'path';
import { formatDate } from '../lib/utils';

export async function getMetadata(trackPath: string) {
  const defaultMetadata = getMetadataDefaults()

  const basicMetadata = {
    ...defaultMetadata,
    path: trackPath,
  }

  try {
    const data = await mmd.parseFile(trackPath, {
      skipCovers: true,
      duration: true,
    });

    const formattedData = formatMusicMetadata(data, trackPath);

    const metadata = {
      ...defaultMetadata,
      ...formattedData,
      path: trackPath,
    };

    return metadata;
  } catch (err) {
    console.log(`Erro ao ler ${trackPath}: ${err}\n`);
  }

  return basicMetadata;
}

/**
 * Returns an object with only the needed data from the file
 */
function formatMusicMetadata(
  data: mmd.IAudioMetadata,
  trackPath: string,
) {
  const { common, format } = data;

  const metadata = {
    title: common.title || path.parse(trackPath).base,
    album: common.album,
    artist:
      common.artists ||
      (common.artist && [common.artist]) ||
      (common.albumartist && [common.albumartist]) || ['Unknown artist'],
    genre: common.genre || ['Unknown'],
    duration: format.duration,
  };

  return metadata;
}

/**
 * Returns default values to blank fields in track's metadata
 */
function getMetadataDefaults() {
  return {
    title: '',
    album: '',
    artist: ['Unknown artist'],
    genre: ['Unknown'],
    duration: 0,
    playCount: 0,
    lastPlayed: new Date(formatDate(new Date())),
    favorite: false,
    path: '',
  };
}

const parseBase64 = (format: string, data: string): string => {
  return `data:${format};base64,${data}`;
};

export async function getCover(trackPath: string) {
  if (!trackPath) {
    return null;
  }

  const data = await mmd.parseFile(trackPath);
  const picture = data.common.picture && data.common.picture[0];

  if (picture) {
    return parseBase64(picture.format, picture.data.toString('base64'));
  }
}