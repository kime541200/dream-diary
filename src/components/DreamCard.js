import React, { useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
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

  // 修正：從 SQLite 取出的資料需要將 string 轉回 Object，才能傳給 PosterTemplate
  const enrichedItem = {
    ...item,
    analysis: item.visualData ? item.visualData : item.analysis
  };

  return (
    <TouchableOpacity 
      onLongPress={handleExport} 
      activeOpacity={0.9} 
      style={styles.cardContainer}
    >
      {/* 直接在畫面上渲染旗艦版海報，並將其作為截圖的目標 */}
      <View ref={posterRef} collapsable={false} style={styles.posterWrapper}>
        <PosterTemplate dream={enrichedItem} />
      </View>
      
      {/* 刪除按鈕疊加在右上角 */}
      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 25,
    alignItems: 'center',
    position: 'relative',
  },
  posterWrapper: {
    // 確保截圖時能包含完整的陰影與圓角
    padding: 10,
  },
  deleteBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
