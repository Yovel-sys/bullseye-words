import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import {
  errorHaptic,
  isHapticEnabled,
  selectionHaptic,
  setHapticEnabled,
  successHaptic,
  tapHaptic,
  toggleHaptic,
} from '../haptics';

jest.mock('expo-haptics', () => ({
  __esModule: true,
  selectionAsync: jest.fn(() => Promise.resolve()),
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  performAndroidHapticsAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium' },
  NotificationFeedbackType: { Success: 'success', Error: 'error' },
  AndroidHaptics: {
    Clock_Tick: 'clock-tick',
    Context_Click: 'context-click',
    Confirm: 'confirm',
    Reject: 'reject',
    Toggle_On: 'toggle-on',
    Toggle_Off: 'toggle-off',
  },
}));

// בווב אין הפטיקה, ולכן שם מצפים לאפס קריאות בכל מקרה.
const expectedCalls = Platform.OS === 'web' ? 0 : 1;

function totalCalls(): number {
  return [
    Haptics.selectionAsync,
    Haptics.impactAsync,
    Haptics.notificationAsync,
    Haptics.performAndroidHapticsAsync,
  ].reduce((sum, fn) => sum + (fn as jest.Mock).mock.calls.length, 0);
}

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setHapticEnabled(true);
  });

  it('defaults to enabled', () => {
    expect(isHapticEnabled()).toBe(true);
  });

  it('tracks the enabled flag set from settings', () => {
    setHapticEnabled(false);
    expect(isHapticEnabled()).toBe(false);
    setHapticEnabled(true);
    expect(isHapticEnabled()).toBe(true);
  });

  it.each([
    ['selection', selectionHaptic],
    ['tap', tapHaptic],
    ['success', successHaptic],
    ['error', errorHaptic],
    ['toggle on', () => toggleHaptic(true)],
    ['toggle off', () => toggleHaptic(false)],
  ])('fires %s feedback when enabled', (_name, fire) => {
    fire();
    expect(totalCalls()).toBe(expectedCalls);
  });

  it.each([
    ['selection', selectionHaptic],
    ['tap', tapHaptic],
    ['success', successHaptic],
    ['error', errorHaptic],
    ['toggle on', () => toggleHaptic(true)],
    ['toggle off', () => toggleHaptic(false)],
  ])('stays silent for %s feedback when disabled', (_name, fire) => {
    setHapticEnabled(false);
    fire();
    expect(totalCalls()).toBe(0);
  });
});
