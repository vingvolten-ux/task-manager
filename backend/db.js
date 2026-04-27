import Database from "better-sqlite3";

const db = new Database("./database.db");

// Create users table
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`).run();

// Create tasks table
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    text TEXT,
    category TEXT,
    dueDate TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`).run();

console.log("Connected to SQLite database");

export default db;