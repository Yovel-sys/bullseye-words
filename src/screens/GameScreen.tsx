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
import GearIcon from '../components/GearIcon';
import ReportModal from '../components/ReportModal';
import { errorHaptic, selectionHaptic, successHaptic, tapHaptic } from '../utils/haptics';

interface GuessEntry {
  guess: string;
  result: GuessResult;
}

interface GameScreenProps {
  wordLength: number;
  onChangeDifficulty: () => void;
  onOpenSettings: () => void;
}

export default function GameScreen({
  wordLength,
  onChangeDifficulty,
  onOpenSettings,
}: GameScreenProps) {
  const [target, setTarget] = useState('');
  const [clue, setClue] = useState('');
  const [clueVisible, setClueVisible] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<GuessEntry[]>([]);
  const [won, setWon] = useState(false);
  const [error, setError] = useState('');
  // דיווח על מילה שגויה: המילה שנדחתה נטענת מראש לטופס
  const [reportVisible, setReportVisible] = useState(false);
  const [reportedWord, setReportedWord] = useState('');
  const inputRef = useRef<TextInput>(null);

  function openReport(word: string) {
    tapHaptic();
    setReportedWord(word);
    setReportVisible(true);
  }

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
      errorHaptic();
      setError('זו לא מילה תקנית בעברית');
      inputRef.current?.focus();
      return;
    }
    setError('');
    const result = scoreGuess(input, target);
    setHistory((prev) => [{ guess: input, result }, ...prev]);
    setInput('');
    if (isWinningGuess(input, target)) {
      successHaptic();
      setWon(true);
    } else {
      tapHaptic();
    }
  }

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) =>
          b.result.bulls - a.result.bulls || b.result.hits - a.result.hits
      ),
    [history]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable
        style={styles.settingsButton}
        onPress={() => {
          tapHaptic();
          onOpenSettings();
        }}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <GearIcon size={20} color="#2b6cb0" />
      </Pressable>
      <Pressable
        style={styles.reportButton}
        onPress={() => openReport('')}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        accessibilityLabel="דיווח על מילה שגויה"
      >
        <Text style={styles.reportButtonText}>🚩</Text>
      </Pressable>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>בול פגיעה</Text>
        <View style={styles.header}>
          <Text style={styles.subtitle}>מילה בת {wordLength} אותיות</Text>
          <Pressable
            onPress={() => {
              tapHaptic();
              onChangeDifficulty();
            }}
          >
            <Text style={styles.changeLink}>שינוי דרגת קושי</Text>
          </Pressable>
        </View>
        {clue.length > 0 &&
          (clueVisible ? (
            <Text style={styles.clue}>רמז: {clue}</Text>
          ) : (
            <Pressable
              style={styles.hintButton}
              onPress={() => {
                tapHaptic();
                setClueVisible(true);
              }}
            >
              <Text style={styles.hintButtonText}>הצג רמז</Text>
            </Pressable>
          ))}

        {won ? (
          <View style={styles.winBox}>
            <Text style={styles.winText}>כל הכבוד! פגעת במילה: {target}</Text>
            <Pressable
              style={styles.button}
              onPress={() => {
                tapHaptic();
                startNewRound();
              }}
            >
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
                if (text.length > input.length) {
                  selectionHaptic();
                }
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

        {error.length > 0 && (
          <View style={styles.errorBox}>
            <Text style={styles.error}>{error}</Text>
            <Pressable onPress={() => openReport(input)}>
              <Text style={styles.errorReportLink}>בטוחים שהמילה תקנית? דווחו לנו</Text>
            </Pressable>
          </View>
        )}

        <FlatList
          style={styles.flex}
          data={sortedHistory}
          keyExtractor={(_, index) => String(index)}
          renderItem={({ item }) => (
            <GuessRow guess={item.guess} result={item.result} />
          )}
          ListEmptyComponent={
            <Text style={styles.hint}>הניחושים שלך יופיעו כאן</Text>
          }
        />
      </KeyboardAvoidingView>

      <ReportModal
        visible={reportVisible}
        title="דיווח על מילה שגויה"
        intro="ניסיתם מילה שאתם בטוחים שהיא תקנית, אבל המשחק לא זיהה אותה? ספרו לנו ונבדוק."
        fields={[
          {
            key: 'word',
            label: 'מה המילה?',
            placeholder: 'לדוגמה: שולחן',
            required: true,
            initialValue: reportedWord,
          },
          {
            key: 'meaning',
            label: 'מה הפירוש שלה?',
            placeholder: 'הסבר קצר על משמעות המילה',
            multiline: true,
          },
        ]}
        onClose={() => setReportVisible(false)}
      />
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
  settingsButton: {
    position: 'absolute',
    top: 44,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3ecf7',
    borderWidth: 1,
    borderColor: '#c6d7ec',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  reportButton: {
    position: 'absolute',
    top: 44,
    left: 68,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e3ecf7',
    borderWidth: 1,
    borderColor: '#c6d7ec',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  reportButtonText: {
    fontSize: 16,
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
  errorBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  error: {
    textAlign: 'center',
    color: '#c0392b',
  },
  errorReportLink: {
    marginTop: 4,
    fontSize: 13,
    color: '#2b6cb0',
    textDecorationLine: 'underline',
  },
});
