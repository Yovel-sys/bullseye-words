import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { scoreGuess, isWinningGuess, type GuessResult } from '../logic/game';
import { LEVELS, pickRandomWord, isValidWord } from '../data/words';
import { loadProgress, saveProgress } from '../state/progress';
import GuessRow from '../components/GuessRow';
import LetterBoxInput from '../components/LetterBoxInput';

interface GuessEntry {
  guess: string;
  result: GuessResult;
}

export default function GameScreen() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [target, setTarget] = useState('');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const wordLength = LEVELS[levelIndex];

  useEffect(() => {
    loadProgress().then((progress) => {
      setLevelIndex(progress.levelIndex);
      setReady(true);
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const word = pickRandomWord(wordLength);
    setTarget(word ?? '');
    setHistory([]);
    setInput('');
    setWon(false);
    setError('');
  }, [levelIndex, ready, wordLength]);

  const canSubmit = useMemo(
    () => input.length === wordLength && !won && target.length > 0,
    [input, wordLength, won, target]
  );

  function handleSubmit() {
    if (!canSubmit) return;
    if (!isValidWord(input)) {
      setError('זו לא מילה תקנית בעברית');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const result = scoreGuess(input, target);
    setHistory((prev) => [{ guess: input, result }, ...prev]);
    setInput('');
    if (isWinningGuess(input, target)) {
      setWon(true);
    }
  }

  function handleNextLevel() {
    const nextIndex = levelIndex + 1;
    if (nextIndex >= LEVELS.length) return;
    setLevelIndex(nextIndex);
    saveProgress({ levelIndex: nextIndex });
  }

  if (!ready) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>טוען...</Text>
      </SafeAreaView>
    );
  }

  const isLastLevel = levelIndex >= LEVELS.length - 1;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>בול פגיעה</Text>
        <Text style={styles.subtitle}>
          שלב {levelIndex + 1} · מילה בת {wordLength} אותיות
        </Text>

        {won ? (
          <View style={styles.winBox}>
            <Text style={styles.winText}>כל הכבוד! פגעת במילה: {target}</Text>
            {isLastLevel ? (
              <Text style={styles.winText}>סיימת את כל השלבים!</Text>
            ) : (
              <Pressable style={styles.button} onPress={handleNextLevel}>
                <Text style={styles.buttonText}>לשלב הבא</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <View style={styles.inputArea}>
            <LetterBoxInput
              ref={inputRef}
              value={input}
              wordLength={wordLength}
              onChangeText={(text) => {
                if (error && text.length > input.length) {
                  const typed = text.slice(input.length);
                  setInput(typed.slice(0, wordLength));
                } else {
                  setInput(text.slice(0, wordLength));
                }
                setError('');
              }}
              onSubmit={handleSubmit}
            />
            <Pressable
              style={[styles.button, !canSubmit && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!canSubmit}
            >
              <Text style={styles.buttonText}>הגש</Text>
            </Pressable>
          </View>
        )}

        {error.length > 0 && <Text style={styles.error}>{error}</Text>}

        <FlatList
          style={styles.flex}
          data={history}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <GuessRow guess={item.guess} result={item.result} />
          )}
          ListEmptyComponent={
            <Text style={styles.hint}>הניחושים שלך יופיעו כאן</Text>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 12,
  },
  inputArea: {
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  winBox: {
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  winText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a7a1a',
    marginBottom: 8,
    textAlign: 'center',
  },
  hint: {
    textAlign: 'center',
    color: '#888',
    marginTop: 24,
  },
  error: {
    textAlign: 'center',
    color: '#c0392b',
    marginBottom: 8,
  },
});
