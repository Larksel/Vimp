import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import fs from 'fs';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import setupFts from './setupFts.sql?raw';
import createMediaRepository from './repositories/mediaRepository';
import createTagRepository from './repositories/tagRepository';
import createWatchedFolderRepository from './repositories/watchedFolderRepository';
import createAlbumRepository from './repositories/albumRepository';
import createArtistRepository from './repositories/artistRepository';
import createPlaylistRepository from './repositories/playlistRepository';
import createAlbumArtistRepository from './repositories/albumArtistRepository';
import createMediaAlbumRepository from './repositories/mediaAlbumRepository';
import createMediaArtistRepository from './repositories/mediaArtistRepository';
import createMediaTagRepository from './repositories/mediaTagRepository';
import createPlaylistItemRepository from './repositories/playlistItemRepository';
import createVideoHistoryRepository from './repositories/videoHistoryRepository';
import createAudioHistoryRepository from './repositories/audioHistoryRepository';
import { relations } from './relations';
import { BaseRepositories } from './types';

function createDatabase(client: Database.Database) {
  return drizzle({ client, relations });
}

export type VimpDatabase = ReturnType<typeof createDatabase>;
export type VimpTransaction = Parameters<
  Parameters<VimpDatabase['transaction']>[0]
>[0];
export type VimpDBExecutor = VimpDatabase | VimpTransaction;

export default class VimpDB extends BaseWindowModule {
  private db?: VimpDatabase;
  private sqlite?: Database.Database;
  private repositories?: ReturnType<typeof this.createRepositories>;

  constructor(window: BrowserWindow) {
    super(window);
  }

  protected async load() {
    const dbPath = import.meta.env.DEV
      ? path.join(__dirname, '../../drizzle/dev.db')
      : path.join(app.getPath('userData'), 'data.db');

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    this.sqlite = new Database(dbPath);
    this.sqlite.pragma('journal_mode = WAL');
    this.db = createDatabase(this.sqlite);

    this.runMigrate();
    this.initializeFts();
    this.repositories = this.createRepositories();
    this.createSystemPlaylists();
  }

  getRepositories() {
    if (!this.loaded || !this.repositories) {
      throw new Error(`Can't create repositories before db connection`);
    }
    return this.repositories;
  }

  private createBaseRepositories(executor: VimpDBExecutor) {
    if (!executor) {
      throw new Error(
        `Failed to create base repositories. Invalid query executor.`,
      );
    }

    return {
      albumArtistRepository: createAlbumArtistRepository(executor),
      albumRepository: createAlbumRepository(executor),
      artistRepository: createArtistRepository(executor),
      audioHistoryRepository: createAudioHistoryRepository(executor),
      mediaAlbumRepository: createMediaAlbumRepository(executor),
      mediaArtistRepository: createMediaArtistRepository(executor),
      mediaRepository: createMediaRepository(executor),
      mediaTagRepository: createMediaTagRepository(executor),
      playlistItemRepository: createPlaylistItemRepository(executor),
      playlistRepository: createPlaylistRepository(executor),
      tagRepository: createTagRepository(executor),
      videoHistoryRepository: createVideoHistoryRepository(executor),
      watchedFolderRepository: createWatchedFolderRepository(executor),
    };
  }

  private createRepositories() {
    if (!this.db) {
      throw new Error(
        `Failed to create repositories. Database didn't initialize correctly.`,
      );
    }

    return {
      ...this.createBaseRepositories(this.db),
      transaction: <T>(
        work: (tx: BaseRepositories) => T extends Promise<unknown> ? never : T,
      ): T => {
        const run = (tx: BaseRepositories) => work(tx) as T;

        return this.db!.transaction((tx): unknown =>
          run(this.createBaseRepositories(tx)),
        ) as T;
      },
    };
  }

  private createSystemPlaylists() {
    if (!this.repositories) {
      throw new Error(
        'Failed to create system playlists. No repositories were available.',
      );
    }

    const { playlistRepository } = this.repositories;
    const existingFavoriteTracks =
      playlistRepository.getBySlug('favorite.tracks');
    const existingFavoriteVideos =
      playlistRepository.getBySlug('favorite.videos');

    if (!existingFavoriteTracks) {
      playlistRepository.insert({
        name: 'Favorite Tracks',
        type: 'audio',
        createdAt: new Date(),
        kind: 'system',
        modifiedAt: new Date(),
        sortMode: 'added_at',
        slug: 'favorite.tracks',
      });
    }

    if (!existingFavoriteVideos) {
      playlistRepository.insert({
        name: 'Favorite Videos',
        type: 'video',
        createdAt: new Date(),
        kind: 'system',
        modifiedAt: new Date(),
        sortMode: 'added_at',
        slug: 'favorite.videos',
      });
    }
  }

  private runMigrate() {
    if (!this.db) {
      throw new Error(`Can't run migrations before db connection`);
    }

    migrate(this.db, {
      migrationsFolder: path.join(__dirname, '../../drizzle'),
    });
  }

  private initializeFts() {
    if (!this.sqlite) {
      throw new Error(`Can't initialize FTS before db connection`);
    }

    this.sqlite.exec(setupFts);
  }
}
