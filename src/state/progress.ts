import AsyncStorage from '@react-native-async-storage/async-storage';
import { DIFFICULTY_LEVELS } from '../data/riddles';

const STORAGE_KEY = 'bullseye-words:progress';

export interface Progress {
  wordLength: number;
}

const DEFAULT_PROGRESS: Progress = { wordLength: DIFFICULTY_LEVELS[0] };

export async function loadProgress(): Promise<Progress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Progress;
    if (
      typeof parsed.wordLength !== 'number' ||
      !DIFFICULTY_LEVELS.includes(parsed.wordLength)
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
