import Database from 'better-sqlite3';
import * as path from 'path';
import * as fs from 'fs';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_PATH = process.env.DB_PATH || path.join(dataDir, 'realestate.db');

// Ensure data directory exists
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const db = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  // Create listings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS listings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image TEXT NOT NULL,
      price TEXT NOT NULL,
      title TEXT NOT NULL,
      type TEXT NOT NULL CHECK(type IN ('매매', '전세')),
      size TEXT NOT NULL,
      bed INTEGER NOT NULL,
      bath INTEGER NOT NULL,
      tags TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create news table
  db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL CHECK(category IN ('뉴스', '가이드', '커뮤니티')),
      image TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create featured_settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS featured_settings (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      price_25 TEXT NOT NULL,
      price_34 TEXT NOT NULL
    )
  `);

  // Insert default featured settings if empty
  const count = db.prepare('SELECT COUNT(*) as count FROM featured_settings').get() as { count: number };
  if (count.count === 0) {
    const stmt = db.prepare('INSERT INTO featured_settings (id, title, price_25, price_34) VALUES (?, ?, ?, ?)');
    stmt.run('graceum_sale', '고덕그라시움 매매', '19억~', '25억~');
    stmt.run('graceum_jeonse', '고덕그라시움 전세', '8억~', '10억~');
    stmt.run('arteon_sale', '고덕아르테온 매매', '18억~', '24억~');
  }

  console.log('✅ Database initialized successfully');
}

// Get database instance
export function getDb() {
  return db;
}

// Backup database
export function backupDatabase() {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const dbDir = path.dirname(DB_PATH);
  const backupPath = path.join(dbDir, `backup-${timestamp}.db`);

  try {
    fs.copyFileSync(DB_PATH, backupPath);
    console.log(`✅ Database backed up to ${backupPath}`);
  } catch (error) {
    console.error('❌ Database backup failed:', error);
  }
}

// Close database connection
export function closeDatabase() {
  db.close();
  console.log('Database connection closed');
}

// Initialize on import
initDatabase();
