import * as SecureStore from 'expo-secure-store';

const KEY = 'DREAM_DIARY_AI_CONFIG';

export const saveConfig = async (config) => {
  try {
    await SecureStore.setItemAsync(KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save config', e);
  }
};

export const loadConfig = async () => {
  try {
    const res = await SecureStore.getItemAsync(KEY);
    return res ? JSON.parse(res) : null;
  } catch (e) {
    return null;
  }
};
