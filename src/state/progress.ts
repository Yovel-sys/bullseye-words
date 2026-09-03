import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS } from '../data/words';

const STORAGE_KEY = 'bullseye-words:progress';

export interface Progress {
  levelIndex: number;
}

const DEFAULT_PROGRESS: Progress = { levelIndex: 0 };

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Progress;
    if (
      typeof parsed.levelIndex !== 'number' ||
      parsed.levelIndex < 0 ||
      parsed.levelIndex >= LEVELS.length
    ) {
      return DEFAULT_PROGRESS;
    }
    return parsed;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export async function saveProgress(progress: Progress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}
