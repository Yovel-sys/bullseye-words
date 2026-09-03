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
  unit tested. Final-form ("sofit") letters (ך ם ן ף ץ) are normalized
  to their regular form before comparing, so either form counts as a
  match.
- `src/logic/hebrew.ts` — the sofit-letter normalization helper.
- `src/data/wordBank.ts` — generated Hebrew word bank (~23k words),
  grouped by word length, covering lengths 2-10.
- `src/data/words.ts` — level helpers (`pickRandomWord`,
  `getWordsForLevel`) plus `isValidWord`, which checks a guess against
  the dictionary (sofit-normalized) so only real words are accepted.
- `src/state/progress.ts` — persists the player's current level locally
  via `@react-native-async-storage/async-storage`.
- `src/screens/GameScreen.tsx` — the main game screen: guess input
  (rejecting non-dictionary words with an inline error), guess history
  with bull/hit feedback, and level progression.
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
The word bank now covers real Hebrew dictionary words for lengths 2-10,
and guesses are validated against it. Remaining work: polish the
win/level-transition UI.

## App store readiness

- Privacy policy: [PRIVACY.md](./PRIVACY.md) (link to the GitHub-rendered
  page — `https://github.com/Yovel-sys/bullseye-words/blob/main/PRIVACY.md`
  — when filling out App Store Connect / Play Console privacy fields).
- `app.json` has real `ios.bundleIdentifier` / `android.package`
  (`com.yovelsys.bullseyewords`) and starting build numbers.
- `eas.json` defines `development`, `preview`, and `production` build
  profiles plus a `submit.production` target. Before the first build,
  run `eas init` (requires an Expo account) to link the project and
  populate `extra.eas.projectId` in `app.json`, and set the `owner`
  field if building under an Expo organization account.
- Still needed before submission: Apple Developer / Google Play Console
  accounts, store listing assets (screenshots, descriptions, content
  rating), and a device test pass (see the summary shared separately).
