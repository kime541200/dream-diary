import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { theme } from '../styles/theme';
import { VisualToken } from './VisualToken';
import { extractTags } from '../services/featureService';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const DreamCard = ({ item, onDelete }) => {
  const tags = extractTags(item.analysis || '');
  // 透過提取 moodColor 和 turbulence (若有儲存於 database)
  const parsedAnalysis = typeof item.analysis === 'string' ? { moodColor: '#7C3AED', turbulence: 0.5 } : item.analysis;

  return (
    <View style={styles.card}>
      <VisualToken 
        path={item.visualData} 
        moodColor={item.moodColor || '#7C3AED'} 
        turbulence={item.turbulence || 0.5}
      />
      <View style={styles.contentArea}>
        <View style={styles.row}>
          <Text style={styles.cardText} numberOfLines={2}>{item.content}</Text>
          <TouchableOpacity 
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onDelete(item.id);
            }} 
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tagContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.card, padding: 18, borderRadius: theme.spacing.borderRadius, marginBottom: 16, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  contentArea: { flex: 1, marginLeft: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardText: { flex: 1, fontSize: 16, color: theme.colors.text, lineHeight: 22, fontWeight: '500' },
  deleteBtn: { padding: 8, marginLeft: 8 },
  deleteText: { color: theme.colors.subtext, fontSize: 18 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  tag: { backgroundColor: theme.colors.accent, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 6 },
  tagText: { fontSize: 12, color: theme.colors.primary, fontWeight: '700' }
});
