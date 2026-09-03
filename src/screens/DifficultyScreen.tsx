import { useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { DIFFICULTY_LEVELS } from '../data/riddles';

interface DifficultyScreenProps {
  initialLength: number;
  onSelect: (wordLength: number) => void;
}

const LABELS: Record<number, string> = {
  2: 'קליל',
  3: 'קל',
  4: 'בינוני',
  5: 'קשה',
  6: 'מומחה',
};

export default function DifficultyScreen({
  initialLength,
  onSelect,
}: DifficultyScreenProps) {
  const [selected, setSelected] = useState(initialLength);

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>בול פגיעה</Text>
      <Text style={styles.subtitle}>בחר/י דרגת קושי</Text>

      <View style={styles.grid}>
        {DIFFICULTY_LEVELS.map((length) => (
          <Pressable
            key={length}
            style={[styles.card, selected === length && styles.cardSelected]}
            onPress={() => setSelected(length)}
          >
            <Text
              style={[
                styles.cardLength,
                selected === length && styles.cardTextSelected,
              ]}
            >
              {length} אותיות
            </Text>
            <Text
              style={[
                styles.cardLabel,
                selected === length && styles.cardTextSelected,
              ]}
            >
              {LABELS[length] ?? ''}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.button} onPress={() => onSelect(selected)}>
        <Text style={styles.buttonText}>התחל משחק</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 100,
    minHeight: 96,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#bbb',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  cardSelected: {
    borderColor: '#2b6cb0',
    backgroundColor: '#2b6cb0',
  },
  cardLength: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
  },
  cardLabel: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  cardTextSelected: {
    color: '#fff',
  },
  button: {
    marginTop: 32,
    backgroundColor: '#2b6cb0',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
});
