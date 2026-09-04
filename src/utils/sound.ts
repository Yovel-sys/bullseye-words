import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

// צלילי המשחק: קליק ללחיצה על כפתור, נקישה להקלדת אות, וצליל
// לתוצאת ההגשה (פגיעה / ניחוש שנקלט / מילה לא תקנית).
const SOUND_FILES = {
  click: require('../../assets/sounds/click.wav'),
  letterClick: require('../../assets/sounds/letterClick.wav'),
  correct: require('../../assets/sounds/correct.wav'),
  incorrect: require('../../assets/sounds/incorrect.wav'),
  guess: require('../../assets/sounds/guess.wav'),
} as const;

type SoundName = keyof typeof SOUND_FILES;

// שחקן אחד לכל צליל, נטען פעם אחת ומשומש חוזר (seekTo + play) בכל הפעלה,
// כדי שלא ניצור נגן חדש (ועיכוב טעינה) בכל נקישה.
const players: Partial<Record<SoundName, AudioPlayer>> = {};
let soundEnabled = true;
let audioModeRequested = false;

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

function getPlayer(name: SoundName): AudioPlayer {
  let player = players[name];
  if (!player) {
    player = createAudioPlayer(SOUND_FILES[name]);
    players[name] = player;
  }
  return player;
}

function ensureAudioMode(): void {
  if (audioModeRequested) return;
  audioModeRequested = true;
  // מאפשר ניגון גם כשהמכשיר במצב שקט (חשוב לצלילי משחק קטנים)
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
}

function play(name: SoundName): void {
  if (!soundEnabled) return;
  ensureAudioMode();
  try {
    const player = getPlayer(name);
    player.seekTo(0).catch(() => {});
    player.play();
  } catch {
    // אם הניגון נכשל (למשל פלטפורמה ללא תמיכה) - לא מפילים את המשחק בגלל זה
  }
}

export function playClickSound(): void {
  play('click');
}

export function playLetterClickSound(): void {
  play('letterClick');
}

export function playCorrectSound(): void {
  play('correct');
}

export function playIncorrectSound(): void {
  play('incorrect');
}

export function playGuessSound(): void {
  play('guess');
}
