// 實作老闆要求的列表、刪除與標籤化邏輯
import { getDreams } from './database';

export const deleteDream = (id) => {
  // SQLite 刪除邏輯預留位
  console.log(`Deleting dream ${id}...`);
};

export const extractTags = (analysis) => {
  return analysis.split(/[,，\s]+/).filter(t => t.length > 0);
};
