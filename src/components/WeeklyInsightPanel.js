import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../styles/theme';
import { generateWeeklyInsight } from '../services/weeklyReportService';

export const WeeklyInsightPanel = () => {
  const insight = generateWeeklyInsight();
  if (insight.dreamCount === 0) return null;

  const moodColor = insight.averageMoodScore > 0 ? '#10B981' : '#F59E0B';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 本週心靈氣象</Text>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>封存夢境</Text>
          <Text style={styles.statValue}>{insight.dreamCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>情緒指數</Text>
          <Text style={[styles.statValue, { color: moodColor }]}>{insight.averageMoodScore.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.moodCloud}>
        {insight.topMoods.map(([mood, count], i) => (
          <View key={i} style={styles.moodItem}>
            <Text style={styles.moodText}>#{mood}</Text>
            <Text style={styles.moodCount}>{count}次</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 25, backgroundColor: theme.colors.card, borderRadius: 30, marginBottom: 20, borderWidth: 1, borderColor: theme.colors.border },
  title: { fontSize: 16, fontWeight: 'bold', color: theme.colors.text, marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statBox: { alignItems: 'center', flex: 1 },
  statLabel: { fontSize: 12, color: theme.colors.subtext, marginBottom: 5 },
  statValue: { fontSize: 28, fontWeight: '800', color: theme.colors.text },
  moodCloud: { flexDirection: 'row', justifyContent: 'center', borderTopWidth: 1, borderTopColor: theme.colors.border, paddingTop: 15 },
  moodItem: { alignItems: 'center', marginHorizontal: 15 },
  moodText: { fontSize: 14, color: theme.colors.primary, fontWeight: '600' },
  moodCount: { fontSize: 10, color: theme.colors.subtext }
});
