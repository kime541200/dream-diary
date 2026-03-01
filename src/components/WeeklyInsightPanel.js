import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { theme } from '../styles/theme';
import { generateWeeklyInsight } from '../services/weeklyReportService';
import { fetchWeeklySummary } from '../services/aiService';
import { loadConfig } from '../services/secureStorage';
import { DreamAtmosphere } from './DreamAtmosphere';

export const WeeklyInsightPanel = () => {
  const [summary, setSummary] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const insight = generateWeeklyInsight();
  
  useEffect(() => {
    const getSummary = async () => {
      if (insight.dreamCount > 0) {
        setIsAnalysing(true);
        const config = await loadConfig();
        const dreams = require('../services/database').getDreams();
        const text = await fetchWeeklySummary(dreams.slice(0, 10), config);
        setSummary(text);
        setIsAnalysing(false);
      }
    };
    getSummary();
  }, [insight.dreamCount]);

  if (insight.dreamCount === 0) return null;
  const moodColor = insight.averageMoodScore > 0 ? '#10B981' : '#F59E0B';

  return (
    <View style={styles.container}>
      <View style={styles.atmosphereWrapper}>
        <DreamAtmosphere moodColor={moodColor} />
      </View>
      <Text style={styles.title}>📅 本週心靈氣象</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statLabel}>封存</Text><Text style={styles.statValue}>{insight.dreamCount}</Text></View>
        <View style={styles.statBox}><Text style={styles.statLabel}>指數</Text><Text style={[styles.statValue, { color: moodColor }]}>{insight.averageMoodScore.toFixed(1)}</Text></View>
      </View>
      <View style={styles.summaryBox}>
        {isAnalysing ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={styles.summaryText}>{summary || '正在解讀潛意識...'}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: theme.colors.card, borderRadius: 30, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
  atmosphereWrapper: { position: 'absolute', top: -30, right: -30, width: 200, height: 200, opacity: 0.5 },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 15, zIndex: 2 },
  statsRow: { flexDirection: 'row', marginBottom: 20, zIndex: 2 },
  statBox: { marginRight: 30 },
  statLabel: { fontSize: 11, color: theme.colors.subtext },
  statValue: { fontSize: 24, fontWeight: '800', color: theme.colors.text },
  summaryBox: { borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 15, zIndex: 2 },
  summaryText: { fontSize: 13, color: theme.colors.text, lineHeight: 20, fontStyle: 'italic', opacity: 0.9 }
});
