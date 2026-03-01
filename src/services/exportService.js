import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export const exportDreamPoster = async (viewRef) => {
  try {
    const uri = await captureRef(viewRef, {
      format: 'png',
      quality: 0.9,
    });

    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('分享失敗', '您的裝置目前不支援原生分享功能');
    }
  } catch (error) {
    console.error('Export Error:', error);
    Alert.alert('導出失敗', '無法生成海報，請檢查權限設定');
  }
};
