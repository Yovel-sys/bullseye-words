import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AnimatedModal from './src/components/AnimatedModal';
import { loadProgress, saveProgress } from './src/state/progress';
import { loadSettings, saveSettings, type Settings } from './src/state/settings';
import { setHapticEnabled } from './src/utils/haptics';

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

      <AnimatedModal visible={settingsOpen} onRequestClose={() => setSettingsOpen(false)}>
        <SettingsScreen
          settings={settings}
          onBack={() => setSettingsOpen(false)}
          onToggleHaptic={(value) => updateSettings({ ...settings, hapticEnabled: value })}
        />
      </AnimatedModal>

      <StatusBar style="auto" />
    </>
  );
}
