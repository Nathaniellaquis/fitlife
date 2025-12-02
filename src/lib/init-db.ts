import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'fitlife.db');
const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
const seedPath = path.join(process.cwd(), 'src/lib/seed.sql');

export function initDatabase(reset = false) {
  // Delete existing database if reset is true
  if (reset && fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Deleted existing database');
  }

  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Read and execute schema
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schema);
  console.log('Schema created successfully');

  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM user').get() as { count: number };

  if (userCount.count === 0) {
    // Read and execute seed data
    const seed = fs.readFileSync(seedPath, 'utf-8');
    db.exec(seed);
    console.log('Seed data inserted successfully');
  } else {
    console.log('Database already has data, skipping seed');
  }

  db.close();
  console.log('Database initialized at:', dbPath);
}

// Run if called directly
if (require.main === module) {
  const reset = process.argv.includes('--reset');
  initDatabase(reset);
}
