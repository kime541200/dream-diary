import { useState, useEffect, useCallback } from 'react';
import { initDB, getDreams, saveDreamRecord, deleteDreamRecord, getTagCloudData } from '../services/database';

export const useDreams = () => {
  const [dreams, setDreams] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(() => {
    const data = getDreams();
    const tagStats = getTagCloudData();
    setDreams(data);
    setStats(tagStats);
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

  return { dreams, stats, isLoading, setIsLoading, addDream, removeDream, refresh };
};
