import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'fitlife.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    try {
      db = new Database(dbPath);
      // Enable WAL mode for better performance
      db.pragma('journal_mode = WAL');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error('Database not available');
    }
  }
  return db;
}

export function query<T>(sql: string, params?: unknown[]): T[] {
  try {
    const database = getDb();
    const stmt = database.prepare(sql);
    return (params ? stmt.all(...params) : stmt.all()) as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export function queryOne<T>(sql: string, params?: unknown[]): T | null {
  try {
    const database = getDb();
    const stmt = database.prepare(sql);
    const result = params ? stmt.get(...params) : stmt.get();
    return (result as T) ?? null;
  } catch (error) {
    console.error('Database queryOne error:', error);
    throw error;
  }
}

export function run(sql: string, params?: unknown[]) {
  try {
    const database = getDb();
    const stmt = database.prepare(sql);
    return params ? stmt.run(...params) : stmt.run();
  } catch (error) {
    console.error('Database run error:', error);
    throw error;
  }
}

export default {
  query,
  queryOne,
  run,
};
