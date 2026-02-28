import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import { theme } from './src/styles/theme';
import { initDB, getDreams, saveDreamRecord, deleteDreamRecord } from './src/services/database';
import { fetchAIVisual } from './src/services/aiService';
import { DreamCard } from './src/components/DreamCard';

function App() {
  const [text, setText] = useState('');
  const [dreams, setDreams] = useState([]);
  const [isSettingVisible, setSettingVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({ apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' });

  useEffect(() => {
    initDB();
    refreshDreams();
  }, []);

  const refreshDreams = () => setDreams(getDreams());

  const handleSave = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    try {
      const { analysis, svg } = await fetchAIVisual(text, config);
      saveDreamRecord(text, analysis, svg);
      refreshDreams();
      setText('');
    } catch (err) {
      Alert.alert('封存失敗', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    Alert.alert('刪除夢境', '確定要讓這段記憶消失嗎？', [
      { text: '取消', style: 'cancel' },
      { text: '確定', onPress: () => { deleteDreamRecord(id); refreshDreams(); }, style: 'destructive' }
    ]);
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
        renderItem={({ item }) => <DreamCard item={item} onDelete={handleDelete} />}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder='昨晚，你夢見了什麼？' value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color='#FFF' /> : <Text style={styles.buttonText}>封存夢境</Text>}
        </TouchableOpacity>
      </View>
      <Modal visible={isSettingVisible} transparent animationType='slide'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI 高階設定</Text>
            <TextInput style={styles.modalInput} value={config.apiKey} onChangeText={(v) => setConfig({ ...config, apiKey: v })} secureTextEntry placeholder='API Key' />
            <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => setSettingVisible(false)}>
              <Text style={styles.buttonText}>確認並關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: theme.colors.text },
  settingBtn: { position: 'absolute', right: 20, top: 60 },
  settingText: { fontSize: 24 },
  list: { flex: 1, paddingHorizontal: theme.spacing.padding },
  inputArea: { padding: 20, backgroundColor: theme.colors.card, borderTopWidth: 1, borderTopColor: theme.colors.border },
  input: { minHeight: 80, padding: 15, backgroundColor: theme.colors.accent, borderRadius: 15, marginBottom: 10, color: theme.colors.text },
  button: { backgroundColor: theme.colors.primary, padding: 16, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: '#FFF', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', backgroundColor: '#FFF', padding: 25, borderRadius: 20 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: theme.colors.text },
  modalInput: { backgroundColor: theme.colors.accent, padding: 12, borderRadius: 10, marginBottom: 10 }
});

registerRootComponent(App);
