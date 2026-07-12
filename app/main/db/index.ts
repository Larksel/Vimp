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
import { VimpDatabase } from '@main/types';
import createServices from '@main/services';
import { relations } from './relations';

export default class VimpDB extends BaseWindowModule {
  private db?: VimpDatabase;
  private sqlite?: Database.Database;
  private repositories?: ReturnType<typeof this.createRepositories>;
  private services?: ReturnType<typeof createServices>;

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
    this.db = drizzle({ client: this.sqlite, relations });

    this.runMigrate();
    this.initializeFts();
    this.repositories = this.createRepositories();
    this.services = createServices(this.db);
    // TODO executar verificações iniciais
    // TODO forçar criação das playlists de sistema (favoritos)
  }

  getRepositories() {
    if (!this.loaded || !this.repositories) {
      throw new Error(`Can't create repositories before db connection`);
    }
    return this.repositories;
  }

  getServices() {
    if (!this.loaded || !this.services) {
      throw new Error(`Can't create services before db connection`);
    }
    return this.services;
  }

  private createRepositories() {
    if (!this.db) {
      throw new Error(
        `Failed to create repositories. Database didn't initialize correctly.`,
      );
    }

    return {
      albumArtistRepository: createAlbumArtistRepository(this.db),
      albumRepository: createAlbumRepository(this.db),
      artistRepository: createArtistRepository(this.db),
      audioHistoryRepository: createAudioHistoryRepository(this.db),
      mediaAlbumRepository: createMediaAlbumRepository(this.db),
      mediaArtistRepository: createMediaArtistRepository(this.db),
      mediaRepository: createMediaRepository(this.db),
      mediaTagRepository: createMediaTagRepository(this.db),
      playlistItemRepository: createPlaylistItemRepository(this.db),
      playlistRepository: createPlaylistRepository(this.db),
      tagRepository: createTagRepository(this.db),
      videoHistoryRepository: createVideoHistoryRepository(this.db),
      watchedFolderRepository: createWatchedFolderRepository(this.db),
    };
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
