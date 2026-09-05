import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Settings } from '../state/settings';
import ReportModal from '../components/ReportModal';
import { tapHaptic, toggleHaptic } from '../utils/haptics';
import { playClickSound } from '../utils/sound';

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
    outputRange: ['#ddc9b4', '#c1541c'],
  });
  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, TOGGLE_TRAVEL],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(!value)}
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

  // אותו רעיון כמו במתג הרטט: בכיבוי משמיעים לפני העדכון (בזמן שהצליל עוד
  // פעיל), ובהפעלה אחריו — כדי שהמשתמש ישמע מיד מה בחר.
  function handleToggleSound(value: boolean) {
    tapHaptic();
    if (!value) playClickSound();
    onToggleSound(value);
    if (value) playClickSound();
  }

  // המשוב עצמו הוא התצוגה המקדימה של המתג: בכיבוי מרטטים לפני העדכון (בזמן
  // שהרטט עוד פעיל), ובהפעלה אחריו — כדי שהמשתמש ירגיש מיד מה בחר.
  function handleToggleHaptic(value: boolean) {
    if (!value) toggleHaptic(false);
    onToggleHaptic(value);
    if (value) toggleHaptic(true);
  }

  return (
    <View style={styles.overlay}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => {
          tapHaptic();
          playClickSound();
          onBack();
        }}
      />
      <View style={styles.dialog}>
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              tapHaptic();
              playClickSound();
              onBack();
            }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={styles.closeButton}>✕</Text>
          </Pressable>
          <Text style={styles.title}>הגדרות</Text>
        </View>

        <Text style={styles.sectionTitle}>סאונד</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>אפקטים קוליים</Text>
            <Toggle value={settings.soundEnabled} onValueChange={handleToggleSound} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>משוב</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>רטט (משוב הפטי)</Text>
            <Toggle
              value={settings.hapticEnabled}
              onValueChange={(value) => {
                playClickSound();
                handleToggleHaptic(value);
              }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>עזרה</Text>
        <View style={styles.card}>
          <Pressable
            style={styles.row}
            onPress={() => {
              tapHaptic();
              playClickSound();
              setBugReportVisible(true);
            }}
          >
            <Text style={styles.rowLabel}>דיווח על באג</Text>
            <Text style={styles.chevron}>‹</Text>
          </Pressable>
        </View>
      </View>

      <ReportModal
        visible={bugReportVisible}
        title="דיווח על באג"
        intro="נתקלתם במשהו שלא עובד כמו שצריך? ספרו לנו ונתקן."
        fields={[
          {
            key: 'title',
            label: 'כותרת',
            placeholder: 'תיאור קצר של הבעיה',
            required: true,
          },
          {
            key: 'description',
            label: 'מה קרה?',
            placeholder: 'ספרו לנו מה קרה, ואיך אפשר לשחזר את הבעיה',
            multiline: true,
          },
        ]}
        onClose={() => setBugReportVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#fdf3e7',
    borderRadius: 20,
    paddingVertical: 16,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3b2a1e',
  },
  closeButton: {
    fontSize: 18,
    color: '#8a7360',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8a7360',
    textAlign: 'right',
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fffaf3',
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e8c199',
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 16,
    color: '#3b2a1e',
  },
  chevron: {
    fontSize: 18,
    color: '#a08a72',
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
});
