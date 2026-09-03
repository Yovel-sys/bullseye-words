/**
 * Final-form ("sofit") Hebrew letters mapped to their regular-form
 * equivalent. Used so a final letter counts as the same letter as its
 * regular form everywhere words are compared (scoring, dictionary
 * lookup) — Hebrew keyboards make it easy to type the wrong form.
 */
const SOFIT_TO_REGULAR: Record<string, string> = {
  ך: 'כ',
  ם: 'מ',
  ן: 'נ',
  ף: 'פ',
  ץ: 'צ',
};

export function normalizeSofit(word: string): string {
  return word
    .split('')
    .map((letter) => SOFIT_TO_REGULAR[letter] ?? letter)
    .join('');
}
