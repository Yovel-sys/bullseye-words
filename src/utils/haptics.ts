import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isSupported = Platform.OS === 'ios' || Platform.OS === 'android';

let hapticEnabled = true;

export function setHapticEnabled(enabled: boolean): void {
  hapticEnabled = enabled;
}

export function isHapticEnabled(): boolean {
  return hapticEnabled;
}

type HapticKind =
  | 'selection'
  | 'tap'
  | 'success'
  | 'error'
  | 'toggleOn'
  | 'toggleOff';

// באנדרואיד impactAsync/notificationAsync רצים דרך Vibrator ודורשים הרשאת
// VIBRATE (שלא מבוקשת באפליקציה), ולכן הם פשוט לא מורגשים שם.
// performAndroidHapticsAsync משתמש במנוע ההפטיקה של המערכת ולא דורש הרשאה,
// אז באנדרואיד זה המסלול המועדף, עם נפילה חזרה למסלול הרגיל במכשירים ישנים.
const ANDROID_EFFECTS: Record<HapticKind, Haptics.AndroidHaptics> = {
  selection: Haptics.AndroidHaptics.Clock_Tick,
  tap: Haptics.AndroidHaptics.Context_Click,
  success: Haptics.AndroidHaptics.Confirm,
  error: Haptics.AndroidHaptics.Reject,
  toggleOn: Haptics.AndroidHaptics.Toggle_On,
  toggleOff: Haptics.AndroidHaptics.Toggle_Off,
};

function genericFeedback(kind: HapticKind): Promise<void> {
  switch (kind) {
    case 'selection':
      return Haptics.selectionAsync();
    case 'success':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    case 'error':
      return Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    case 'toggleOn':
    case 'toggleOff':
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    case 'tap':
    default:
      return Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }
}

function trigger(kind: HapticKind): void {
  if (!isSupported || !hapticEnabled) return;

  if (Platform.OS === 'android') {
    Haptics.performAndroidHapticsAsync(ANDROID_EFFECTS[kind]).catch(() => {
      genericFeedback(kind).catch(() => {});
    });
    return;
  }

  genericFeedback(kind).catch(() => {});
}

/** בחירה קלה: הקלדת אות, מעבר בין אפשרויות. */
export function selectionHaptic(): void {
  trigger('selection');
}

/** נגיעה רגילה: כפתורים וקישורים. */
export function tapHaptic(): void {
  trigger('tap');
}

/** הצלחה: ניחוש נכון, שליחת דיווח. */
export function successHaptic(): void {
  trigger('success');
}

/** כישלון: מילה לא תקנית, פעולה שנדחתה. */
export function errorHaptic(): void {
  trigger('error');
}

/** משוב על שינוי מצב של מתג. */
export function toggleHaptic(value: boolean): void {
  trigger(value ? 'toggleOn' : 'toggleOff');
}
