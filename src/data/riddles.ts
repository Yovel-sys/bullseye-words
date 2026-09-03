/**
 * Hand-picked riddles (word + clue), grouped by word length. Used so a
 * chosen difficulty level always has a guaranteed clue to show, unlike
 * the full dictionary in wordBank.ts where most words have no riddle.
 * Every word here also appears in WORDS_BY_LENGTH for its length.
 */
export interface Riddle {
  word: string;
  clue: string;
}

export const RIDDLES_BY_LENGTH: Record<number, Riddle[]> = {
  2: [
    { word: 'ים', clue: 'שטח מים מלוחים וגדול, אפשר לשחות בו בקיץ' },
    { word: 'אש', clue: 'בוערת, חמה ומאירה, וצריך להיזהר ממנה' },
    { word: 'לב', clue: 'האיבר שפועם בחזה שלנו' },
    { word: 'קר', clue: 'ההפך מ"חם"' },
    { word: 'יד', clue: 'איתה כותבים ואוחזים בדברים' },
  ],
  3: [
    { word: 'בית', clue: 'המקום שבו אנחנו גרים' },
    { word: 'כלב', clue: 'חיה נאמנה שנובחת ואוהבת לשחק עם כדור' },
    { word: 'שמש', clue: 'הכוכב המאיר לנו ביום ונותן חום' },
    { word: 'פרח', clue: 'צומח בגינה, יש לו עלי כותרת וריח נעים' },
    { word: 'ילד', clue: 'בן אדם צעיר, עוד לא מבוגר' },
  ],
  4: [
    { word: 'תפוח', clue: 'פרי אדום או ירוק, אומרים שהוא שומר על רופאים הרחק' },
    { word: 'כדור', clue: 'עגול, מגלגלים ובועטים בו במשחק' },
    { word: 'מחשב', clue: 'מכשיר עם מסך ומקלדת שכותבים ומשחקים בו' },
    { word: 'רכבת', clue: 'נוסעת על פסים ועוצרת בתחנות' },
    { word: 'מטוס', clue: 'טס גבוה בשמיים ולוקח נוסעים למקומות רחוקים' },
  ],
  5: [
    { word: 'שולחן', clue: 'רהיט עם רגליים שאוכלים או כותבים עליו' },
    { word: 'תלמיד', clue: 'הולך לבית הספר וכל יום לומד משהו חדש' },
    { word: 'גלידה', clue: 'קינוח קר ומתוק שאוכלים בעיקר בקיץ' },
    { word: 'ציפור', clue: 'בעלת כנפיים, שרה בבוקר ויודעת לעוף' },
    { word: 'שמיכה', clue: 'מתכסים בה במיטה כדי להישאר חמים' },
  ],
  6: [
    { word: 'מכונית', clue: 'כלי רכב בעל ארבעה גלגלים שנוסעים בו בכביש' },
    { word: 'שוקולד', clue: 'ממתק חום ומתוק, אהוב על ילדים ומבוגרים' },
    { word: 'תפוזים', clue: 'פירות כתומים ועסיסיים שסוחטים מהם מיץ' },
    { word: 'חלומות', clue: 'מה שרואים בשינה בזמן שהמוח ממשיך לעבוד' },
    { word: 'מטריות', clue: 'פותחים אותן כשיורד גשם כדי לא להירטב' },
  ],
};

export const DIFFICULTY_LEVELS = Object.keys(RIDDLES_BY_LENGTH)
  .map(Number)
  .sort((a, b) => a - b);

export function getRiddlesForLength(wordLength: number): Riddle[] {
  return RIDDLES_BY_LENGTH[wordLength] ?? [];
}

export function pickRandomRiddle(wordLength: number): Riddle | undefined {
  const riddles = getRiddlesForLength(wordLength);
  if (riddles.length === 0) return undefined;
  return riddles[Math.floor(Math.random() * riddles.length)];
}
