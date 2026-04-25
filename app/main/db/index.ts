import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { schema } from './schema';
import fs from 'fs';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import setupFts from './setupFts.sql?raw';
import createMediaRepository from './repositories/mediaRepository';

export default class VimpDB extends BaseWindowModule {
  private db?: BetterSQLite3Database<typeof schema>;
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
    this.db = drizzle(this.sqlite, { schema });

    this.runMigrate();
    this.initializeFts();
    this.repositories = this.createRepositories();
    // TODO executar verificações iniciais
  }

  getRepositories() {
    if (!this.loaded) {
      throw new Error(`Can't create repositories before db connection`);
    }
    return this.repositories;
  }

  private createRepositories() {
    if (!this.db) {
      throw new Error(
        `Failed to create repositories. Database didn't initialize correctly.`,
      );
    }

    return {
      mediaRepository: createMediaRepository(this.db),
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
