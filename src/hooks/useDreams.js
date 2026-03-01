import { useState, useEffect, useCallback } from 'react';
import { initDB, getDreams, saveDreamRecord, deleteDreamRecord } from '../services/database';

export const useDreams = () => {
  const [dreams, setDreams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    const data = getDreams();
    setDreams(data);
  }, []);

  useEffect(() => {
    initDB();
    refresh();
  }, [refresh]);

  const addDream = async (content, analysis, visual) => {
    saveDreamRecord(content, analysis, visual);
    refresh();
  };

  const removeDream = (id) => {
    deleteDreamRecord(id);
    refresh();
  };

  return { dreams, isLoading, setIsLoading, addDream, removeDream };
};
