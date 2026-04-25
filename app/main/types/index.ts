import { schema } from '@main/db/schema';
import { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';

export type VimpDB = BetterSQLite3Database<typeof schema>;
