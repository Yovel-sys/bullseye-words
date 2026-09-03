import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface LetterBoxInputProps {
  value: string;
  wordLength: number;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
}

const LetterBoxInput = forwardRef<TextInput, LetterBoxInputProps>(
  ({ value, wordLength, onChangeText, onSubmit }, ref) => {
    const cells = Array.from({ length: wordLength }, (_, index) => value[index] ?? '');

    return (
      <Pressable
        style={styles.wrapper}
        onPress={() => {
          if (typeof ref !== 'function' && ref?.current) {
            ref.current.focus();
          }
        }}
      >
        <View style={styles.boxes}>
          {cells.map((letter, index) => (
            <View
              key={index}
              style={[styles.cell, letter ? styles.cellFilled : undefined]}
            >
              <Text style={styles.cellText}>{letter}</Text>
            </View>
          ))}
        </View>
        <TextInput
          ref={ref}
          style={styles.hiddenInput}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={onSubmit}
          autoFocus
          blurOnSubmit={false}
          caretHidden
        />
      </Pressable>
    );
  }
);

LetterBoxInput.displayName = 'LetterBoxInput';

export default LetterBoxInput;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  boxes: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
  },
  cell: {
    width: 48,
    height: 48,
    borderWidth: 2,
    borderColor: '#bbb',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  cellFilled: {
    borderColor: '#2b6cb0',
  },
  cellText: {
    fontSize: 24,
    fontWeight: '700',
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});
