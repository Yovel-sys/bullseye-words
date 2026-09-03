import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Settings } from '../state/settings';
import { tapHaptic } from '../utils/haptics';

interface SettingsScreenProps {
  settings: Settings;
  onBack: () => void;
  onToggleSound: (value: boolean) => void;
  onToggleHaptic: (value: boolean) => void;
}

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const TOGGLE_TRAVEL = 20;

// מתג מותאם אישית במקום ה-Switch המובנה: על אנדרואיד ה-Switch המובנה
// מתעלם לפעמים מ-trackColor ומציג את צבע ה-accent הירוק של המערכת.
function Toggle({ value, onValueChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [value, anim]);

  const trackBackground = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#2b6cb0'],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_TRAVEL],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        tapHaptic();
        onValueChange(!value);
      }}
    >
      <Animated.View style={[styles.toggleTrack, { backgroundColor: trackBackground }]}>
        <Animated.View style={[styles.toggleThumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function SettingsScreen({
  settings,
  onBack,
  onToggleSound,
  onToggleHaptic,
}: SettingsScreenProps) {
  const [bugReportVisible, setBugReportVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            tapHaptic();
            onBack();
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.backButton}>‹ חזרה</Text>
        </Pressable>
        <Text style={styles.title}>הגדרות</Text>
      </View>

      <Text style={styles.sectionTitle}>סאונד</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>אפקטים קוליים</Text>
          <Toggle value={settings.soundEnabled} onValueChange={onToggleSound} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>משוב</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>רטט (משוב הפטי)</Text>
          <Toggle value={settings.hapticEnabled} onValueChange={onToggleHaptic} />
        </View>
      </View>

      <Text style={styles.sectionTitle}>עזרה</Text>
      <View style={styles.card}>
        <Pressable
          style={styles.row}
          onPress={() => {
            tapHaptic();
            setBugReportVisible(true);
          }}
        >
          <Text style={styles.rowLabel}>דיווח על באג</Text>
          <Text style={styles.chevron}>‹</Text>
        </Pressable>
      </View>

      <Modal
        visible={bugReportVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBugReportVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => {
            tapHaptic();
            setBugReportVisible(false);
          }}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalText}>בקרוב</Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  backButton: {
    fontSize: 16,
    color: '#2b6cb0',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
    textAlign: 'right',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e2e2e2',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
  },
  chevron: {
    fontSize: 18,
    color: '#999',
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 40,
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
});
