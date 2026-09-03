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
import { isValidWord, pickRoundTarget } from '../data/words';
import GuessRow from '../components/GuessRow';
import LetterBoxInput from '../components/LetterBoxInput';

interface GuessEntry {
  guess: string;
  result: GuessResult;
}

interface GameScreenProps {
  wordLength: number;
  onChangeDifficulty: () => void;
}

export default function GameScreen({
  wordLength,
  onChangeDifficulty,
}: GameScreenProps) {
  const [target, setTarget] = useState('');
  const [clue, setClue] = useState('');
  const [clueVisible, setClueVisible] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  function startNewRound() {
    const round = pickRoundTarget(wordLength);
    setTarget(round?.word ?? '');
    setClue(round?.clue ?? '');
    setClueVisible(false);
    setHistory([]);
    setInput('');
    setWon(false);
    setError('');
  }

  useEffect(() => {
    startNewRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordLength]);

  const canSubmit = useMemo(
    () => input.length === wordLength && !won && target.length > 0,
    [input, wordLength, won, target]
  );

  function handleSubmit() {
    if (!canSubmit) return;
    if (!isValidWord(input)) {
      setError('זו לא מילה תקנית בעברית');
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

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>בול פגיעה</Text>
        <View style={styles.header}>
          <Text style={styles.subtitle}>מילה בת {wordLength} אותיות</Text>
          <Pressable onPress={onChangeDifficulty}>
            <Text style={styles.changeLink}>שינוי דרגת קושי</Text>
          </Pressable>
        </View>
        {clue.length > 0 &&
          (clueVisible ? (
            <Text style={styles.clue}>רמז: {clue}</Text>
          ) : (
            <Pressable
              style={styles.hintButton}
              onPress={() => setClueVisible(true)}
            >
              <Text style={styles.hintButtonText}>הצג רמז</Text>
            </Pressable>
          ))}

        {won ? (
          <View style={styles.winBox}>
            <Text style={styles.winText}>כל הכבוד! פגעת במילה: {target}</Text>
            <Pressable style={styles.button} onPress={startNewRound}>
              <Text style={styles.buttonText}>מילה חדשה</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.inputArea}>
            <LetterBoxInput
              ref={inputRef}
              value={input}
              wordLength={wordLength}
              onChangeText={(text) => {
                setInput(text);
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
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  changeLink: {
    fontSize: 14,
    color: '#2b6cb0',
    textDecorationLine: 'underline',
  },
  clue: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
    paddingHorizontal: 24,
  },
  hintButton: {
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#2b6cb0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  hintButtonText: {
    color: '#2b6cb0',
    fontWeight: '600',
    fontSize: 14,
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
