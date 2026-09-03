import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { loadProgress, saveProgress } from './src/state/progress';
import { loadSettings, saveSettings, type Settings } from './src/state/settings';
import { setHapticEnabled } from './src/utils/haptics';

type Screen = 'difficulty' | 'game' | 'settings';

export default function App() {
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [screen, setScreen] = useState<Screen>('difficulty');

  useEffect(() => {
    loadProgress().then((progress) => {
      setWordLength(progress.wordLength);
    });
    loadSettings().then((loaded) => {
      setHapticEnabled(loaded.hapticEnabled);
      setSettings(loaded);
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
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>טוען...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {screen === 'settings' ? (
        <SettingsScreen
          settings={settings}
          onBack={() => setScreen('difficulty')}
          onToggleSound={(value) => updateSettings({ ...settings, soundEnabled: value })}
          onToggleHaptic={(value) => updateSettings({ ...settings, hapticEnabled: value })}
        />
      ) : screen === 'difficulty' ? (
        <DifficultyScreen
          initialLength={wordLength}
          onSelect={handleSelectDifficulty}
          onOpenSettings={() => setScreen('settings')}
        />
      ) : (
        <GameScreen
          wordLength={wordLength}
          onChangeDifficulty={() => setScreen('difficulty')}
        />
      )}
      <StatusBar style="auto" />
    </>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    fontSize: 20,
  },
});
