import { getDreams } from './database';
import { analyzeDreamSentiment } from './analyticsService';

export const generateWeeklyInsight = () => {
  const dreams = getDreams();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const weeklyDreams = dreams.filter(d => d.timestamp > oneWeekAgo);

  let totalScore = 0;
  const moodCounts = {};

  weeklyDreams.forEach(dream => {
    const sentiments = analyzeDreamSentiment(dream.analysis || '');
    sentiments.forEach(s => {
      totalScore += s.value;
      moodCounts[s.tag] = (moodCounts[s.tag] || 0) + 1;
    });
  });

  const averageMoodScore = weeklyDreams.length > 0 ? totalScore / weeklyDreams.length : 0;
  return {
    period: 'Past 7 Days',
    averageMoodScore,
    topMoods: Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 3),
    dreamCount: weeklyDreams.length
  };
};
