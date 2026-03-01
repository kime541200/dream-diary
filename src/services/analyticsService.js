// 潛意識情緒分析引擎預研
export const analyzeDreamSentiment = (analysisText) => {
  const sentimentMap = {
    '平和': { color: '#10B981', value: 1 },
    '焦慮': { color: '#F59E0B', value: -1 },
    '恐懼': { color: '#EF4444', value: -2 },
    '喜悅': { color: '#EC4899', value: 2 },
    '深邃': { color: '#6366F1', value: 1.5 }
  };
  
  const tags = analysisText.split(/[,，\s]+/);
  return tags.map(tag => ({
    tag,
    ...(sentimentMap[tag] || { color: '#94A3B8', value: 0 })
  }));
};
