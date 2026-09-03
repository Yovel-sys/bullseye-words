# בול פגיעה (Bullseye Words)

A Hebrew word-guessing mobile game, Mastermind-style: guess the target
word letter by letter and get **בול** (bullseye — right letter, right
position) / **פגיעה** (hit — right letter, wrong position) feedback after
each guess. Each level increases the target word length, starting at 2
letters.

## Stack

Built with **Expo (React Native + TypeScript)** — a single codebase for
iOS, Android, and web, fast local iteration via Expo Go, and a
straightforward Jest setup for testing pure game logic without a device
or simulator.

## Project layout

- `src/logic/game.ts` — scoring (bulls/hits) and win-check logic, fully
  unit tested.
- `src/data/words.ts` — Hebrew word bank grouped by word length (one
  level per length). Currently a small starter list for lengths 2-4;
  extend `WORDS_BY_LENGTH` to add more words or levels.
- `src/state/progress.ts` — persists the player's current level locally
  via `@react-native-async-storage/async-storage`.
- `src/screens/GameScreen.tsx` — the main game screen: guess input,
  guess history with bull/hit feedback, and level progression.
- `src/components/GuessRow.tsx` — renders one past guess as a letter
  grid plus its score.

## Getting started

```bash
npm install
npm start        # opens Expo dev tools; press w/a/i for web/Android/iOS
```

## Testing

```bash
npm test
```

## Status / next steps

This is an MVP covering level 1 (2-letter words) end-to-end, with the
scoring engine and level progression generalized to any word length.
Remaining work: grow the word bank per level, add input validation
against the word list (currently any same-length guess is accepted),
and polish the win/level-transition UI.
