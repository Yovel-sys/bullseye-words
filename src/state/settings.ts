import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'bullseye-words:settings';

export interface Settings {
  hapticEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = { hapticEnabled: true };

export async function loadSettings(): Promise<Settings> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<Settings>;
    return {
      hapticEnabled:
        typeof parsed.hapticEnabled === 'boolean'
          ? parsed.hapticEnabled
          : DEFAULT_SETTINGS.hapticEnabled,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Settings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
