import { isValidWord, getWordsForLevel, LEVELS } from '../words';

describe('isValidWord', () => {
  it('accepts a real dictionary word', () => {
    expect(isValidWord('בית')).toBe(true);
  });

  it('rejects a string that is not a real word', () => {
    expect(isValidWord('קךצע')).toBe(false);
  });

  it('rejects a length with no dictionary entries', () => {
    expect(isValidWord('א'.repeat(50))).toBe(false);
  });

  it('accepts a word spelled with the "wrong" sofit form', () => {
    // 'אבא' is a real word; swapping the trailing regular letter for a
    // final-form letter should still validate against the dictionary.
    const words = getWordsForLevel(4);
    const withFinalLetter = words.find((w) => w.endsWith('ם'));
    expect(withFinalLetter).toBeDefined();
    const regularForm = withFinalLetter!.slice(0, -1) + 'מ';
    expect(isValidWord(regularForm)).toBe(true);
  });
});

describe('word bank coverage', () => {
  it('has a non-trivial pool of words for every level', () => {
    for (const length of LEVELS) {
      expect(getWordsForLevel(length).length).toBeGreaterThan(0);
    }
  });
});
