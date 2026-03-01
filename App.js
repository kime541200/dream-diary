import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { registerRootComponent } from 'expo';
import { theme } from './src/styles/theme';
import { useDreams } from './src/hooks/useDreams';
import { fetchAIVisual, validateConnection } from './src/services/aiService';
import { DreamCard } from './src/components/DreamCard';
import { StatsPanel } from './src/components/StatsPanel';
import { WeeklyInsightPanel } from './src/components/WeeklyInsightPanel';
import { saveConfig, loadConfig } from './src/services/secureStorage';

function App() {
  const { dreams, stats, isLoading, setIsLoading, addDream, removeDream } = useDreams();
  const [text, setText] = useState('');
  const [isSettingVisible, setSettingVisible] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [config, setConfig] = useState({ 
    apiKey: '', 
    baseUrl: 'https://api.openai.com/v1', 
    model: 'gpt-4o-mini',
    temperature: '0.7',
    top_p: '1',
    max_tokens: '1000'
  });

  useEffect(() => {
    const initConfig = async () => {
      const saved = await loadConfig();
      if (saved) setConfig({ ...config, ...saved });
    };
    initConfig();
  }, []);

  const handleTestConnection = async () => {
    setIsValidating(true);
    try {
      await validateConnection(config);
      Alert.alert('連線成功', '您的 AI 密鑰配置正確！');
    } catch (err) {
      Alert.alert('連線失敗', err.message);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSaveConfig = async () => {
    await saveConfig(config);
    setSettingVisible(false);
  };

  const handleSaveDream = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const result = await fetchAIVisual(text, config);
      if (!result.analysis) throw new Error('AI 解析無效');
      await addDream(text, result.analysis, JSON.stringify(result));
      setText('');
    } catch (err) {
      console.error('封存出錯:', err);
      Alert.alert('封存失敗', err.message || '請檢查 API 設定與網路連線');
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
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <WeeklyInsightPanel />
            <StatsPanel stats={stats} />
          </View>
        }
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

      <Modal visible={isSettingVisible} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🛡️ 進階配置與加密設定</Text>
            
            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>API Key (必填)</Text>
              <TextInput style={styles.modalInput} value={config.apiKey} onChangeText={(v) => setConfig({ ...config, apiKey: v })} secureTextEntry placeholder='sk-...' placeholderTextColor={theme.colors.subtext} />
              
              <Text style={styles.label}>Base URL</Text>
              <TextInput style={styles.modalInput} value={config.baseUrl} onChangeText={(v) => setConfig({ ...config, baseUrl: v })} placeholder='https://api.openai.com/v1' placeholderTextColor={theme.colors.subtext} />
              
              <Text style={styles.label}>模型名稱</Text>
              <TextInput style={styles.modalInput} value={config.model} onChangeText={(v) => setConfig({ ...config, model: v })} placeholder='gpt-4o-mini' placeholderTextColor={theme.colors.subtext} />
              
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.label}>溫度 (0.0-2.0)</Text>
                  <TextInput style={styles.modalInput} value={config.temperature} onChangeText={(v) => setConfig({ ...config, temperature: v })} keyboardType='numeric' placeholder='0.7' />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.label}>Top P (0.0-1.0)</Text>
                  <TextInput style={styles.modalInput} value={config.top_p} onChangeText={(v) => setConfig({ ...config, top_p: v })} keyboardType='numeric' placeholder='1.0' />
                </View>
              </View>

              <Text style={styles.label}>最大生成的 Token 數</Text>
              <TextInput style={styles.modalInput} value={config.max_tokens} onChangeText={(v) => setConfig({ ...config, max_tokens: v })} keyboardType='numeric' placeholder='1000' />
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.accent, marginBottom: 10 }]} onPress={handleTestConnection} disabled={isValidating}>
                {isValidating ? <ActivityIndicator color={theme.colors.primary} /> : <Text style={[styles.buttonText, { color: theme.colors.primary }]}>測試連線</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSaveConfig}>
                <Text style={styles.buttonText}>儲存並返回</Text>
              </TouchableOpacity>
            </View>
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
  listHeader: { paddingHorizontal: 0 },
  list: { flex: 1, paddingHorizontal: theme.spacing.padding },
  inputArea: { padding: 25, backgroundColor: theme.colors.card, borderTopLeftRadius: 30, borderTopRightRadius: 30, shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 20 },
  input: { minHeight: 80, padding: 18, backgroundColor: theme.colors.accent, borderRadius: 20, marginBottom: 15, color: theme.colors.text, fontSize: 16 },
  button: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 35, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.95)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxHeight: '80%', backgroundColor: theme.colors.card, padding: 25, borderRadius: 30, borderWidth: 1, borderColor: theme.colors.border },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: theme.colors.text, textAlign: 'center' },
  modalScroll: { marginBottom: 20 },
  label: { fontSize: 13, color: theme.colors.subtext, marginBottom: 8, marginLeft: 5 },
  modalInput: { backgroundColor: theme.colors.accent, padding: 12, borderRadius: 12, marginBottom: 15, color: theme.colors.text },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  modalFooter: { marginTop: 10 }
});

registerRootComponent(App);
