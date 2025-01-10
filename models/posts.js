const sqlite3 = require('sqlite3').verbose();
const db = require('./users');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        userId INTEGER,
        FOREIGN KEY(userId) REFERENCES users(id)
    )`);
});

module.exports = db;