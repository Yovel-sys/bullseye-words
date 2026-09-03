import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DifficultyScreen from './src/screens/DifficultyScreen';
import GameScreen from './src/screens/GameScreen';
import { loadProgress, saveProgress } from './src/state/progress';

export default function App() {
  const [wordLength, setWordLength] = useState<number | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(true);

  useEffect(() => {
    loadProgress().then((progress) => {
      setWordLength(progress.wordLength);
    });
  }, []);

  function handleSelectDifficulty(length: number) {
    setWordLength(length);
    setShowDifficulty(false);
    saveProgress({ wordLength: length });
  }

  if (wordLength === null) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.loading}>טוען...</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      {showDifficulty ? (
        <DifficultyScreen
          initialLength={wordLength}
          onSelect={handleSelectDifficulty}
        />
      ) : (
        <GameScreen
          wordLength={wordLength}
          onChangeDifficulty={() => setShowDifficulty(true)}
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
