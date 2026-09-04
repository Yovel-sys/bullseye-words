import { useEffect, useState } from 'react';
import { Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { loadProgress, saveProgress } from './src/state/progress';
import { loadSettings, saveSettings, type Settings } from './src/state/settings';
import { setHapticEnabled } from './src/utils/haptics';
import { setSoundEnabled } from './src/utils/sound';

SplashScreen.preventAutoHideAsync().catch(() => {});

type Screen = 'difficulty' | 'game';

export default function App() {
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [screen, setScreen] = useState<Screen>('difficulty');
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    Promise.all([loadProgress(), loadSettings()]).then(([progress, loadedSettings]) => {
      setWordLength(progress.wordLength);
      setHapticEnabled(loadedSettings.hapticEnabled);
      setSoundEnabled(loadedSettings.soundEnabled);
      setSettings(loadedSettings);
      SplashScreen.hideAsync();
    });
  }, []);

  function handleSelectDifficulty(length: number) {
    setWordLength(length);
    setScreen('game');
    saveProgress({ wordLength: length });
  }

  function updateSettings(next: Settings) {
    setSettings(next);
    setHapticEnabled(next.hapticEnabled);
    setSoundEnabled(next.soundEnabled);
    saveSettings(next);
  }

  if (wordLength === null || settings === null) {
    return null;
  }

  return (
    <>
      {screen === 'difficulty' ? (
        <DifficultyScreen
          initialLength={wordLength}
          onSelect={handleSelectDifficulty}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      ) : (
        <GameScreen
          wordLength={wordLength}
          onChangeDifficulty={() => setScreen('difficulty')}
          onOpenSettings={() => setSettingsOpen(true)}
        />
      )}

      <Modal
        visible={settingsOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setSettingsOpen(false)}
      >
        <SettingsScreen
          settings={settings}
          onBack={() => setSettingsOpen(false)}
          onToggleSound={(value) => updateSettings({ ...settings, soundEnabled: value })}
          onToggleHaptic={(value) => updateSettings({ ...settings, hapticEnabled: value })}
        />
      </Modal>

      <StatusBar style="auto" />
    </>
  );
}
