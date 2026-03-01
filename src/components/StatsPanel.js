import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { theme } from '../styles/theme';

export const StatsPanel = ({ stats }) => {
  if (!stats || stats.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📊 潛意識熱圖</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagWrapper}>
        {stats.map((tag, index) => {
          const fontSize = Math.min(24, 12 + tag.value * 2);
          const opacity = Math.min(1, 0.4 + tag.value * 0.1);
          return (
            <View key={index} style={[styles.tag, { opacity }]}>
              <Text style={[styles.tagText, { fontSize }]}>#{tag.name}</Text>
              <Text style={styles.count}>{tag.value}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: theme.colors.card + '80', borderRadius: 20, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border },
  header: { fontSize: 14, fontWeight: 'bold', color: theme.colors.subtext, marginBottom: 12, letterSpacing: 1 },
  tagWrapper: { alignItems: 'flex-end', paddingBottom: 5 },
  tag: { flexDirection: 'row', alignItems: 'center', marginRight: 15, backgroundColor: theme.colors.accent, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15 },
  tagText: { color: theme.colors.primary, fontWeight: 'bold' },
  count: { fontSize: 10, color: theme.colors.subtext, marginLeft: 4, fontWeight: 'bold' }
});
