const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("DB Error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    text TEXT,
    category TEXT,
    dueDate TEXT,
    completed INTEGER DEFAULT 0,
    FOREIGN KEY (userId) REFERENCES users(id)
  )
`);

db.run(`
CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER,
  text TEXT,
  category TEXT,
  dueDate TEXT,
  completed INTEGER DEFAULT 0
)
`);

module.exports = db;