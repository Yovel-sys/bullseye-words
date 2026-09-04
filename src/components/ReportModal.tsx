import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { successHaptic, tapHaptic } from '../utils/haptics';

export interface ReportField {
  key: string;
  label: string;
  placeholder: string;
  multiline?: boolean;
  required?: boolean;
  initialValue?: string;
}

interface ReportModalProps {
  visible: boolean;
  title: string;
  intro?: string;
  fields: ReportField[];
  successTitle?: string;
  successMessage?: string;
  onClose: () => void;
  onSubmit?: (values: Record<string, string>) => void;
}

function initialValues(fields: ReportField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, f.initialValue ?? '']));
}

// טופס דיווח כללי (באג / מילה שגויה). כרגע מוקאפ בלבד: הדיווח לא נשלח
// לשום שרת, אלא רק מוצג מסך תודה. ה-onSubmit נועד לחיבור עתידי לשרת.
export default function ReportModal({
  visible,
  title,
  intro,
  fields,
  successTitle = 'תודה! 🙏',
  successMessage = 'קיבלנו את הדיווח שלך ונבדוק אותו בהקדם.',
  onClose,
  onSubmit,
}: ReportModalProps) {
  const [values, setValues] = useState<Record<string, string>>(() => initialValues(fields));
  const [submitted, setSubmitted] = useState(false);

  // כל פתיחה מחדש של הטופס מתחילה מדף נקי (כולל ערכים שהוזנו מראש).
  useEffect(() => {
    if (visible) {
      setValues(initialValues(fields));
      setSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const canSubmit = fields.every((f) => !f.required || values[f.key]?.trim());

  function handleSubmit() {
    if (!canSubmit) return;
    successHaptic();
    onSubmit?.(values);
    setSubmitted(true);
  }

  function handleClose() {
    tapHaptic();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <KeyboardAvoidingView
          style={styles.cardWrapper}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.card}>
            {submitted ? (
              <>
                <Text style={styles.title}>{successTitle}</Text>
                <Text style={styles.message}>{successMessage}</Text>
                <Pressable
                  style={[styles.button, styles.submitButton, styles.singleButton]}
                  onPress={handleClose}
                >
                  <Text style={styles.submitText}>סגירה</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.title}>{title}</Text>
                {intro ? <Text style={styles.message}>{intro}</Text> : null}

                {fields.map((field) => (
                  <View key={field.key}>
                    <Text style={styles.fieldLabel}>{field.label}</Text>
                    <TextInput
                      style={[styles.input, field.multiline && styles.inputMultiline]}
                      value={values[field.key] ?? ''}
                      onChangeText={(text) =>
                        setValues((prev) => ({ ...prev, [field.key]: text }))
                      }
                      placeholder={field.placeholder}
                      placeholderTextColor="#a8b4c4"
                      textAlign="right"
                      multiline={field.multiline}
                    />
                  </View>
                ))}

                <View style={styles.buttons}>
                  <Pressable
                    style={[
                      styles.button,
                      styles.submitButton,
                      !canSubmit && styles.buttonDisabled,
                    ]}
                    onPress={handleSubmit}
                    disabled={!canSubmit}
                  >
                    <Text style={styles.submitText}>שליחה</Text>
                  </Pressable>
                  <Pressable style={[styles.button, styles.cancelButton]} onPress={handleClose}>
                    <Text style={styles.cancelText}>ביטול</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 360,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    textAlign: 'right',
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c6d7ec',
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1a202c',
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  buttons: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
  },
  singleButton: {
    flex: 0,
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: '#2b6cb0',
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  cancelButton: {
    backgroundColor: '#e3ecf7',
    borderWidth: 1,
    borderColor: '#c6d7ec',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2b6cb0',
  },
});
