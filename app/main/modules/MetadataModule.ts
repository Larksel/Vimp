import { parseFile, IAudioMetadata } from 'music-metadata';
import { createMainLogger } from '@main/logger';
import path from 'path';
import { Track } from '@shared/types/vimp';
import BaseModule from './BaseModule';
import { app, net, protocol } from 'electron';
import { IMetadataModule } from '@shared/interfaces/modules/IMetadataModule';
import { mkdir, stat, writeFile, access } from 'fs/promises';
import { createHash } from 'crypto';
import { pathToFileURL } from 'url';
import { vimpProtocols } from '@shared/constants/vimpProtocols';

const logger = createMainLogger('Metadata');

export default class MetadataModule
  extends BaseModule
  implements IMetadataModule
{
  private artworksDir!: string;

  constructor() {
    super();
  }

  protected async load() {
    this.artworksDir = path.join(app.getPath('userData'), 'artworks');
    await mkdir(this.artworksDir, { recursive: true });
    protocol.handle(vimpProtocols.vimpArtwork, async (request) => {
      const coverPath = this.resolveCoverPathFromRequest(request.url);

      if (!coverPath || !(await this.fileExists(coverPath))) {
        return new Response('Cover not found', {
          status: 404,
          headers: {
            'content-type': 'text/plain',
          },
        });
      }

      return net.fetch(pathToFileURL(coverPath).toString());
    });
  }

  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets metadata from a file
   */
  async getMetadata(trackPath: string): Promise<Track> {
    const defaultMetadata = this.getMetadataDefaults();

    const basicMetadata = {
      ...defaultMetadata,
      path: trackPath,
    };

    let cover: string | null = null;

    try {
      const data = await this.extractFileMetadata(trackPath);
      const formattedData = await this.formatMusicMetadata(data, trackPath);

      const picture = data.common.picture?.[0];
      if (picture) {
        cover = await this.persistCover(picture.format, picture.data);
      }

      const metadata = {
        ...defaultMetadata,
        ...formattedData,
        cover,
        path: trackPath,
      };

      return metadata;
    } catch (err) {
      logger.error(`Erro ao ler ${trackPath}: ${err}\n`);
    }

    return basicMetadata;
  }

  private async extractFileMetadata(filePath: string) {
    return await parseFile(filePath, {
      skipCovers: false,
      duration: true,
    });
  }

  private async persistCover(format: string, data: Buffer): Promise<string> {
    const fileContents = new Uint8Array(data);
    const hash = createHash('sha1').update(fileContents).digest('hex');
    const extension = format.replace('image/', '');
    const coverPath = path.join(this.artworksDir, `${hash}.${extension}`);

    if (!(await this.fileExists(coverPath))) {
      await writeFile(coverPath, fileContents);
    }

    return this.getCoverUrl(path.basename(coverPath));
  }

  private getCoverUrl(fileName: string): string {
    return `${vimpProtocols.vimpArtwork}://local/${encodeURIComponent(fileName)}`;
  }

  private resolveCoverPathFromRequest(requestUrl: string): string | null {
    const { pathname } = new URL(requestUrl);
    const fileName = decodeURIComponent(pathname.replace(/^\/+/, ''));
    const sanitizedFileName = path.basename(fileName);

    if (!sanitizedFileName) {
      return null;
    }

    return path.join(this.artworksDir, sanitizedFileName);
  }

  /**
   * Returns default values to blank fields in track's metadata
   */
  private getMetadataDefaults(): Track {
    return {
      title: 'Unknown Track',
      artist: ['Unknown artist'],
      genre: ['Unknown'],
      duration: 0,
      playCount: 0,
      favorite: false,
      path: '',
      cover: null,
    };
  }

  /**
   * Returns an object with only the needed data from the file
   */
  private async formatMusicMetadata(data: IAudioMetadata, trackPath: string) {
    const { common, format } = data;
    const stats = await stat(trackPath);
    const dateModified: Date = stats.mtime;

    const metadata = {
      title: common.title ?? path.parse(trackPath).base,
      album: common.album,
      artist: common.artists ||
        (common.artist && [common.artist]) ||
        (common.albumartist && [common.albumartist]) || ['Unknown artist'],
      genre: common.genre || ['Unknown'],
      duration: format.duration ?? 0,
      dateModified: dateModified,
    };

    return metadata;
  }
}
