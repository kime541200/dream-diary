import * as SQLite from 'expo-sqlite';
const db = SQLite.openDatabaseSync('dreams.db');

export const initDB = () => {
  // 建立基礎表結構
  db.execSync('CREATE TABLE IF NOT EXISTS dreams (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, analysis TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP);');
  
  // 檢查並補齊缺失的 visualData 欄位 (處理舊版本資料表)
  try {
    const tableInfo = db.getAllSync('PRAGMA table_info(dreams);');
    const hasVisualData = tableInfo.some(column => column.name === 'visualData');
    if (!hasVisualData) {
      db.execSync('ALTER TABLE dreams ADD COLUMN visualData TEXT;');
      console.log('成功修復資料庫：已補齊 visualData 欄位');
    }
  } catch (e) {
    console.warn('資料庫檢查跳過：', e.message);
  }
};

export const getDreams = () => {
  return db.getAllSync('SELECT * FROM dreams ORDER BY id DESC');
};

export const saveDreamRecord = (content, analysis, visual) => {
  return db.runSync('INSERT INTO dreams (content, analysis, visualData) VALUES (?, ?, ?);', content, analysis, visual);
};

export const deleteDreamRecord = (id) => {
  return db.runSync('DELETE FROM dreams WHERE id = ?;', id);
};

// 新增：統計標籤頻率的分析函數
export const getTagCloudData = () => {
  const dreams = getDreams();
  const tagCounts = {};
  dreams.forEach(d => {
    const tags = d.analysis ? d.analysis.split(/[,，\s]+/).filter(Boolean) : [];
    tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  return Object.entries(tagCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};
