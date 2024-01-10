import * as mmd from 'music-metadata';
import path from 'path';

//TODO resolver problema de valores undefined. Ex: artist: undefined (deveria ser Unknown Artist)

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
    album: common.album,
    artist:
      common.artists ||
      (common.artist && [common.artist]) ||
      (common.albumartist && [common.albumartist]),
    duration: format.duration,
    genre: common.genre,
    title: common.title || path.parse(trackPath).base,
    year: common.year,
  };

  return metadata;
}

/**
 * Returns default values to blank fields in track's metadata
 */
function getMetadataDefaults() {
  return {
    album: 'Unknown',
    artist: ['Unknown artist'],
    duration: 0,
    genre: [],
    path: '',
    playCount: 0,
    title: '',
    year: null,
  };
}