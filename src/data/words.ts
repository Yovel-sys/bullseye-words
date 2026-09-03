/**
 * Hebrew word bank, grouped by word length. Level N uses the list at
 * key N. Duplicate letters within a word are fine — scoreGuess handles
 * them correctly.
 */
export const WORDS_BY_LENGTH: Record<number, string[]> = {
  2: ['אב', 'אם', 'יד', 'עץ', 'דג', 'לב', 'שן', 'עם', 'טל', 'גג'],
  3: ['בית', 'ילד', 'ספר', 'שמש', 'ירח', 'דלת', 'עוף', 'סוס', 'דבש', 'מלח'],
  4: ['מחשב', 'תפוח', 'חלון', 'גינה', 'ארנב', 'תפוז', 'כובע', 'שעון', 'מפתח'],
};

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
