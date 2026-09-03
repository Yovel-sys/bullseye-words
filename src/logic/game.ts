export interface GuessResult {
  bulls: number;
  hits: number;
}

/**
 * Scores a guess against a target word, Mastermind-style:
 * - bulls: letters correct and in the correct position.
 * - hits: letters that appear in the target but in the wrong position,
 *   counted using remaining letter frequencies so duplicates are never
 *   double-counted beyond how many times they actually occur.
 */
export function scoreGuess(guess: string, target: string): GuessResult {
  if (guess.length !== target.length) {
    throw new Error('Guess and target must be the same length');
  }

  const length = target.length;
  const guessLetters = guess.split('');
  const targetLetters = target.split('');

  let bulls = 0;
  const remainingGuess: string[] = [];
  const remainingTarget: string[] = [];

  for (let i = 0; i < length; i++) {
    if (guessLetters[i] === targetLetters[i]) {
      bulls++;
    } else {
      remainingGuess.push(guessLetters[i]);
      remainingTarget.push(targetLetters[i]);
    }
  }

  const targetCounts = new Map<string, number>();
  for (const letter of remainingTarget) {
    targetCounts.set(letter, (targetCounts.get(letter) ?? 0) + 1);
  }

  let hits = 0;
  for (const letter of remainingGuess) {
    const count = targetCounts.get(letter) ?? 0;
    if (count > 0) {
      hits++;
      targetCounts.set(letter, count - 1);
    }
  }

  return { bulls, hits };
}

export function isWinningGuess(guess: string, target: string): boolean {
  return guess === target;
}
