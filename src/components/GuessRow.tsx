import { StyleSheet, Text, View } from 'react-native';
import type { GuessResult } from '../logic/game';

interface GuessRowProps {
  guess: string;
  result: GuessResult;
}

export default function GuessRow({ guess, result }: GuessRowProps) {
  const letters = guess.split('');

  return (
    <View style={styles.row}>
      <View style={styles.letters}>
        {letters.map((letter, index) => (
          <View key={index} style={styles.cell}>
            <Text style={styles.cellText}>{letter}</Text>
          </View>
        ))}
      </View>
      <View style={styles.score}>
        <Text style={styles.bulls}>בול {result.bulls}</Text>
        <Text style={styles.hits}>פגיעה {result.hits}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  letters: {
    flexDirection: 'row-reverse',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cellText: {
    fontSize: 20,
    fontWeight: '600',
  },
  score: {
    flexDirection: 'row-reverse',
    minWidth: 120,
  },
  bulls: {
    marginHorizontal: 4,
    color: '#1a7a1a',
    fontWeight: '700',
  },
  hits: {
    marginHorizontal: 4,
    color: '#b8860b',
    fontWeight: '700',
  },
});
