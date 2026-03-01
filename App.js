import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import { theme } from './src/styles/theme';
import { useDreams } from './src/hooks/useDreams';
import { fetchAIVisual } from './src/services/aiService';
import { DreamCard } from './src/components/DreamCard';
import { StatsPanel } from './src/components/StatsPanel';
import { saveConfig, loadConfig } from './src/services/secureStorage';

function App() {
  const { dreams, stats, isLoading, setIsLoading, addDream, removeDream } = useDreams();
  const [text, setText] = useState('');
  const [isSettingVisible, setSettingVisible] = useState(false);
  const [config, setConfig] = useState({ apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' });

  useEffect(() => {
    const initConfig = async () => {
      const saved = await loadConfig();
      if (saved) setConfig(saved);
    };
    initConfig();
  }, []);

  const handleSaveConfig = async () => {
    await saveConfig(config);
    setSettingVisible(false);
  };

  const handleSaveDream = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await fetchAIVisual(text, config);
      await addDream(text, result.analysis, JSON.stringify(result));
      setText('');
    } catch (err) {
      Alert.alert('封存失敗', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌙 夢境封存盒</Text>
        <TouchableOpacity onPress={() => setSettingVisible(true)} style={styles.settingBtn}>
          <Text style={styles.settingText}>⚙️</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={dreams}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<StatsPanel stats={stats} />}
        renderItem={({ item }) => <DreamCard item={item} onDelete={removeDream} />}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder='昨晚，你夢見了什麼？' placeholderTextColor={theme.colors.subtext} value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSaveDream} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color='#FFF' /> : <Text style={styles.buttonText}>封存夢境</Text>}
        </TouchableOpacity>
      </View>

      <Modal visible={isSettingVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🛡️ 安全加密設定</Text>
            <TextInput style={styles.modalInput} value={config.apiKey} onChangeText={(v) => setConfig({ ...config, apiKey: v })} secureTextEntry placeholder='OpenAI API Key' placeholderTextColor={theme.colors.subtext} />
            <TouchableOpacity style={styles.button} onPress={handleSaveConfig}>
              <Text style={styles.buttonText}>加密儲存並返回</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingTop: 60, paddingBottom: 10, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, letterSpacing: 2 },
  settingBtn: { position: 'absolute', right: 20, top: 60 },
  settingText: { fontSize: 24 },
  list: { flex: 1, paddingHorizontal: theme.spacing.padding },
  inputArea: { padding: 25, backgroundColor: theme.colors.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 20 },
  input: { minHeight: 80, padding: 18, backgroundColor: theme.colors.accent, borderRadius: 20, marginBottom: 15, color: theme.colors.text, fontSize: 16 },
  button: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 35, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: theme.colors.card, padding: 30, borderRadius: 30, borderWidth: 1, borderColor: theme.colors.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25, color: theme.colors.text, textAlign: 'center' },
  modalInput: { backgroundColor: theme.colors.accent, padding: 15, borderRadius: 15, marginBottom: 20, color: theme.colors.text }
});

registerRootComponent(App);
