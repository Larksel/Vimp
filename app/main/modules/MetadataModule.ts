import { parseFile, IAudioMetadata } from 'music-metadata';
import path from 'path';
import { Track } from '@shared/types/vimp';
import BaseModule from './BaseModule';
import { ipcMain } from 'electron';
import IPCChannels from '@shared/constants/IPCChannels';
import { IMetadataModule } from '@interfaces/modules/IMetadataModule';

export default class MetadataModule extends BaseModule implements IMetadataModule {
  constructor() {
    super();
  }

  protected async load() {
    ipcMain.handle(IPCChannels.METADATA_GET_COVER, async (_, trackPath: string) => {
      return this.getCover(trackPath);
    });
  }

  async getMetadata(trackPath: string): Promise<Track> {
    const defaultMetadata = this.getMetadataDefaults();

    const basicMetadata = {
      ...defaultMetadata,
      path: trackPath,
    };

    try {
      const data = await parseFile(trackPath, {
        skipCovers: false,
        duration: true,
      });

      const formattedData = this.formatMusicMetadata(data, trackPath);

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

  async getCover(trackPath: string) {
    if (!trackPath) {
      return null;
    }

    const data = await parseFile(trackPath);
    const picture = data.common.picture?.[0];

    if (picture) {
      return this.parseBase64(picture.format, picture.data.toString('base64'));
    }

    return null;
  }

  private parseBase64(format: string, data: string): string {
    return `data:${format};base64,${data}`;
  }

  /**
   * Returns default values to blank fields in track's metadata
   */
  private getMetadataDefaults(): Track {
    return {
      title: '',
      artist: ['Unknown artist'],
      genre: ['Unknown'],
      duration: 0,
      playCount: 0,
      favorite: false,
      path: '',
      cover: '',
    };
  }

  /**
   * Returns an object with only the needed data from the file
   */
  private formatMusicMetadata(data: IAudioMetadata, trackPath: string) {
    const { common, format } = data;
    const picture = common.picture?.[0];

    const metadata = {
      title: common.title ?? path.parse(trackPath).base,
      album: common.album,
      artist: common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]) || ['Unknown artist'],
      genre: common.genre || ['Unknown'],
      duration: format.duration,
    };

    if (picture) {
      return {
        ...metadata,
        cover: this.parseBase64(picture.format, picture.data.toString('base64')),
      };
    }

    return metadata;
  }
}
