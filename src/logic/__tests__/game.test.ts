import { scoreGuess, isWinningGuess } from '../game';

describe('scoreGuess', () => {
  it('returns full bulls for an exact match', () => {
    expect(scoreGuess('אב', 'אב')).toEqual({ bulls: 2, hits: 0 });
  });

  it('returns 0 bulls and 0 hits when no letters match', () => {
    expect(scoreGuess('אב', 'גד')).toEqual({ bulls: 0, hits: 0 });
  });

  it('counts a correct letter in the wrong position as a hit', () => {
    expect(scoreGuess('בא', 'אב')).toEqual({ bulls: 0, hits: 2 });
  });

  it('mixes bulls and hits', () => {
    // target: אבג, guess: אגב -> א bull, ב and ג swapped -> 2 hits
    expect(scoreGuess('אגב', 'אבג')).toEqual({ bulls: 1, hits: 2 });
  });

  it('does not double count duplicate letters beyond their occurrences', () => {
    // target has one 'א', guess has two 'א's -> only one can score
    expect(scoreGuess('אאב', 'אגד')).toEqual({ bulls: 1, hits: 0 });
  });

  it('handles duplicate letters split between bulls and hits correctly', () => {
    // target: 'גגד', guess: 'דגג' -> middle ג is a bull, ד and the other ג are hits
    expect(scoreGuess('דגג', 'גגד')).toEqual({ bulls: 1, hits: 2 });
  });

  it('throws when lengths differ', () => {
    expect(() => scoreGuess('אב', 'אבג')).toThrow();
  });
});

describe('isWinningGuess', () => {
  it('is true only for an exact match', () => {
    expect(isWinningGuess('אב', 'אב')).toBe(true);
    expect(isWinningGuess('בא', 'אב')).toBe(false);
  });
});
