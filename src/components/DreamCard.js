import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../styles/theme';
import { VisualToken } from './VisualToken';
import { exportDreamPoster } from '../services/exportService';
import { PosterTemplate } from './PosterTemplate';

export const DreamCard = ({ item, onDelete }) => {
  const posterRef = useRef();

  const handleExport = async () => {
    Alert.alert('導出藝術海報', '準備將您的夢境轉化為視覺藝術品並分享？', [
      { text: '取消', style: 'cancel' },
      { text: '確認導出', onPress: () => exportDreamPoster(posterRef) }
    ]);
  };

  return (
    <TouchableOpacity onLongPress={handleExport} activeOpacity={0.9} style={styles.card}>
      <View ref={posterRef} collapsable={false} style={styles.snapshotContainer}>
        <PosterTemplate dream={item} />
      </View>
      
      <View style={styles.mainContent}>
        <VisualToken visualData={item.visualData ? JSON.parse(item.visualData) : {}} />
        <View style={styles.textContent}>
          <Text style={styles.date}>{new Date(item.timestamp).toLocaleDateString()}</Text>
          <Text style={styles.content} numberOfLines={3}>{item.content}</Text>
          <View style={styles.tagContainer}>
            {item.analysis?.split(/[,，\s]+/).map((tag, i) => (
              <Text key={i} style={styles.tag}>#{tag}</Text>
            ))}
          </View>
        </View>
      </View>
      
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: theme.colors.card, borderRadius: 25, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: theme.colors.border, overflow: 'hidden' },
  snapshotContainer: { position: 'absolute', left: -1000, top: -1000 },
  mainContent: { flexDirection: 'row', alignItems: 'center' },
  textContent: { flex: 1, marginLeft: 15 },
  date: { fontSize: 10, color: theme.colors.subtext, marginBottom: 5 },
  content: { color: theme.colors.text, fontSize: 15, lineHeight: 22, marginBottom: 8 },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: { color: theme.colors.primary, fontSize: 11, marginRight: 8, fontWeight: 'bold' },
  deleteBtn: { position: 'absolute', top: 15, right: 15, width: 24, height: 24, justifyContent: 'center', alignItems: 'center' },
  deleteText: { color: theme.colors.subtext, fontSize: 18 }
});
