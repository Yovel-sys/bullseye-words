import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const isSupported = Platform.OS !== 'web';

let hapticEnabled = true;

export function setHapticEnabled(enabled: boolean): void {
  hapticEnabled = enabled;
}

export function tapHaptic(): void {
  if (!isSupported || !hapticEnabled) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function successHaptic(): void {
  if (!isSupported || !hapticEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function errorHaptic(): void {
  if (!isSupported || !hapticEnabled) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
