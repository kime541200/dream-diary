import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('dreams.db');
export const initDB = () => {
  db.execSync('CREATE TABLE IF NOT EXISTS dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, analysis TEXT, visualData TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);');
};
export const getDreams = () => db.getAllSync('SELECT * FROM dreams ORDER BY id DESC');
export const saveDreamRecord = (content, analysis, visual) => db.runSync('INSERT INTO dreams (content, analysis, visualData) VALUES (?, ?, ?);', content, analysis, visual);
export const deleteDreamRecord = (id) => db.runSync('DELETE FROM dreams WHERE id = ?;', id);
