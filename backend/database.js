const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./menu.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_ru TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_kg TEXT NOT NULL,
      image_url TEXT,
      is_hidden INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category_id INTEGER,
      name_ru TEXT NOT NULL,
      name_en TEXT NOT NULL,
      name_kg TEXT NOT NULL,
      price REAL,
      image_url TEXT,
      is_hidden INTEGER DEFAULT 0,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )
  `);
});

module.exports = db;
