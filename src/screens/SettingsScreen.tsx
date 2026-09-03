import { useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
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
          <Switch
            value={settings.soundEnabled}
            onValueChange={(value) => {
              tapHaptic();
              onToggleSound(value);
            }}
            trackColor={{ false: '#ccc', true: '#2b6cb0' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>משוב</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>רטט (משוב הפטי)</Text>
          <Switch
            value={settings.hapticEnabled}
            onValueChange={(value) => {
              tapHaptic();
              onToggleHaptic(value);
            }}
            trackColor={{ false: '#ccc', true: '#2b6cb0' }}
            thumbColor="#fff"
          />
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
