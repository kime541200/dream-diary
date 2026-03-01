import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, FlatList, KeyboardAvoidingView, Platform, Modal, ActivityIndicator, Alert } from 'react-native';
import { registerRootComponent } from 'expo';
import { theme } from './src/styles/theme';
import { useDreams } from './src/hooks/useDreams';
import { fetchAIVisual } from './src/services/aiService';
import { DreamCard } from './src/components/DreamCard';

function App() {
  const { dreams, isLoading, setIsLoading, addDream, removeDream } = useDreams();
  const [text, setText] = useState('');
  const [isSettingVisible, setSettingVisible] = useState(false);
  const [config, setConfig] = useState({ apiKey: '', baseUrl: 'https://api.openai.com/v1', model: 'gpt-4o-mini' });

  const handleSave = async () => {
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
        renderItem={({ item }) => <DreamCard item={item} onDelete={removeDream} />}
        style={styles.list}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <View style={styles.inputArea}>
        <TextInput style={styles.input} placeholder='昨晚，你夢見了什麼？' placeholderTextColor={theme.colors.subtext} value={text} onChangeText={setText} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isLoading}>
          {isLoading ? <ActivityIndicator color='#FFF' /> : <Text style={styles.buttonText}>封存夢境</Text>}
        </TouchableOpacity>
      </View>
      <Modal visible={isSettingVisible} transparent animationType='fade'>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>AI 高階設定</Text>
            <TextInput style={styles.modalInput} value={config.apiKey} onChangeText={(v) => setConfig({ ...config, apiKey: v })} secureTextEntry placeholder='API Key' />
            <TouchableOpacity style={styles.button} onPress={() => setSettingVisible(false)}>
              <Text style={styles.buttonText}>儲存並返回</Text>
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
  title: { fontSize: 24, fontWeight: 'bold', color: theme.colors.text, letterSpacing: 2 },
  settingBtn: { position: 'absolute', right: 20, top: 60 },
  settingText: { fontSize: 24 },
  list: { flex: 1, paddingHorizontal: theme.spacing.padding },
  inputArea: { padding: 25, backgroundColor: theme.colors.card, borderTopLeftRadius: 30, borderTopRightRadius: 30 },
  input: { minHeight: 100, padding: 18, backgroundColor: theme.colors.accent, borderRadius: 20, marginBottom: 15, color: theme.colors.text, fontSize: 16 },
  button: { backgroundColor: theme.colors.primary, padding: 18, borderRadius: 35, alignItems: 'center', shadowColor: theme.colors.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20 },
  buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: theme.colors.card, padding: 30, borderRadius: 30, borderSize: 1, borderColor: theme.colors.border },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 25, color: theme.colors.text, textAlign: 'center' },
  modalInput: { backgroundColor: theme.colors.accent, padding: 15, borderRadius: 15, marginBottom: 20, color: theme.colors.text }
});

registerRootComponent(App);
