import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const PosterTemplate = ({ dream }) => {
  const date = new Date(dream?.createdAt || Date.now()).toLocaleDateString('zh-TW', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  let emotion = '未解析';
  let tags = [];
  try {
    const parsed = typeof dream?.analysis === 'string' ? JSON.parse(dream?.analysis) : dream?.analysis;
    if (parsed) {
      emotion = parsed.emotion || emotion;
      tags = parsed.keywords || [];
    }
  } catch (e) {
    console.warn('AI 數據解析失敗', e);
  }

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <View style={styles.header}>
          <Text style={styles.date}>{date}</Text>
          <View style={styles.emotionBadge}>
            <Text style={styles.emotionText}>{emotion}</Text>
          </View>
        </View>
        <View style={styles.visualPlaceholder}>
          <View style={styles.orb} />
        </View>
        <View style={styles.divider} />
        <Text style={styles.content} numberOfLines={5}>
          {dream?.content || '（無夢境內容）'}
        </Text>
        <View style={styles.tagContainer}>
          {tags.map((tag, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width * 0.85,
    backgroundColor: '#12121A',
    borderRadius: 24,
    padding: 4,
    shadowColor: '#8A2BE2',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
    marginVertical: 15,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 13,
    letterSpacing: 1.5,
    fontWeight: '500',
  },
  emotionBadge: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(138, 43, 226, 0.3)',
  },
  emotionText: {
    color: '#D8B4FE',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  visualPlaceholder: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  orb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: 16,
  },
  content: {
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 26,
    letterSpacing: 0.5,
    marginBottom: 20,
    fontWeight: '400',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    letterSpacing: 0.5,
  }
});
