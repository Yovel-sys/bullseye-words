import { normalizeSofit } from '../logic/hebrew';
import { WORDS_BY_LENGTH } from './wordBank';
import { pickRandomRiddle, type Riddle } from './riddles';

export { WORDS_BY_LENGTH };

export const LEVELS = Object.keys(WORDS_BY_LENGTH)
  .map(Number)
  .sort((a, b) => a - b);

export function getWordsForLevel(wordLength: number): string[] {
  return WORDS_BY_LENGTH[wordLength] ?? [];
}

export function pickRandomWord(wordLength: number): string | undefined {
  const words = getWordsForLevel(wordLength);
  if (words.length === 0) return undefined;
  return words[Math.floor(Math.random() * words.length)];
}

/**
 * Picks the target word for a round. Prefers a riddle from the curated
 * set for `wordLength` so a clue is always available; falls back to a
 * random dictionary word for lengths without riddles.
 */
export function pickRoundTarget(wordLength: number): Riddle | undefined {
  const riddle = pickRandomRiddle(wordLength);
  if (riddle) return riddle;
  const word = pickRandomWord(wordLength);
  return word ? { word, clue: '' } : undefined;
}

// Sets of sofit-normalized dictionary words, keyed by word length, built
// once and reused for every validity check.
const NORMALIZED_WORDS_BY_LENGTH = new Map<number, Set<string>>(
  Object.entries(WORDS_BY_LENGTH).map(([length, words]) => [
    Number(length),
    new Set(words.map(normalizeSofit)),
  ])
);

/**
 * Whether `guess` is a real word from the dictionary for its length.
 * Sofit letters are normalized first, so a guess spelled with the
 * "wrong" final-letter form still validates.
 */
export function isValidWord(guess: string): boolean {
  const words = NORMALIZED_WORDS_BY_LENGTH.get(guess.length);
  if (!words) return false;
  return words.has(normalizeSofit(guess));
}
