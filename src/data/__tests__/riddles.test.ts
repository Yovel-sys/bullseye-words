import { DIFFICULTY_LEVELS, RIDDLES_BY_LENGTH } from '../riddles';
import { isValidWord } from '../words';

describe('riddle bank', () => {
  it('covers word lengths 2 through 6', () => {
    expect(DIFFICULTY_LEVELS).toEqual([2, 3, 4, 5, 6]);
  });

  it('has at least 3 riddles for every difficulty level', () => {
    for (const length of DIFFICULTY_LEVELS) {
      expect(RIDDLES_BY_LENGTH[length].length).toBeGreaterThanOrEqual(3);
    }
  });

  it('every riddle word matches its bucket length and is a real dictionary word', () => {
    for (const length of DIFFICULTY_LEVELS) {
      for (const { word, clue } of RIDDLES_BY_LENGTH[length]) {
        expect(word.length).toBe(length);
        expect(isValidWord(word)).toBe(true);
        expect(clue.length).toBeGreaterThan(0);
      }
    }
  });
});
