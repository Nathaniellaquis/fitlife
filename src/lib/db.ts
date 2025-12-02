import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'fitlife.db');
const db = new Database(dbPath);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');

export function query<T>(sql: string, params?: unknown[]): T[] {
  const stmt = db.prepare(sql);
  return (params ? stmt.all(...params) : stmt.all()) as T[];
}

export function queryOne<T>(sql: string, params?: unknown[]): T | null {
  const stmt = db.prepare(sql);
  const result = params ? stmt.get(...params) : stmt.get();
  return (result as T) ?? null;
}

export function run(sql: string, params?: unknown[]) {
  const stmt = db.prepare(sql);
  return params ? stmt.run(...params) : stmt.run();
}

export default db;
