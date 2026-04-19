import { BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { schema } from './schema';
import fs from 'fs';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import BaseWindowModule from '@main/modules/BaseWindowModule';
import setupFts from './setupFts.sql?raw';

export default class VimpDB extends BaseWindowModule {
  private db: BetterSQLite3Database<typeof schema>;
  private sqlite: Database.Database;

  constructor(window: BrowserWindow) {
    super(window);

    const dbPath = import.meta.env.DEV
      ? path.join(__dirname, '../../drizzle/dev.db')
      : path.join(app.getPath('userData'), 'data.db');

    fs.mkdirSync(path.dirname(dbPath), { recursive: true });

    this.sqlite = new Database(dbPath);
    this.sqlite.pragma('journal_mode = WAL');

    this.db = drizzle(this.sqlite, { schema });
  }

  protected async load() {
    this.runMigrate();
    this.initializeFts();
    // TODO executar verificações iniciais
  }

  getInstance() {
    return this.db;
  }

  runMigrate() {
    migrate(this.db, {
      migrationsFolder: path.join(__dirname, '../../drizzle'),
    });
  }

  initializeFts() {
    this.sqlite.exec(setupFts);
  }
}
