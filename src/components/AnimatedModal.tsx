import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated, Modal, Platform, StyleSheet } from 'react-native';

// אנימציית הפתיחה/סגירה נעשית ידנית (animationType="none") כי ה-fade
// המובנה של Modal איטי יחסית (~300ms) ולא ניתן לכוונון.
const OPEN_DURATION = 140;
const CLOSE_DURATION = 110;

interface AnimatedModalProps {
  visible: boolean;
  onRequestClose: () => void;
  /** צבע ההצללה מאחורי התוכן; הוא לא מוגדל יחד איתו כדי שלא ייווצרו שוליים. */
  dimColor?: string;
  children: ReactNode;
}

export default function AnimatedModal({
  visible,
  onRequestClose,
  dimColor = 'rgba(0, 0, 0, 0.4)',
  children,
}: AnimatedModalProps) {
  // ה-Modal נשאר מורכב עד שאנימציית הסגירה מסתיימת.
  const [rendered, setRendered] = useState(visible);
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) setRendered(true);
    const animation = Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: visible ? OPEN_DURATION : CLOSE_DURATION,
      useNativeDriver: Platform.OS !== 'web',
    });
    animation.start(({ finished }) => {
      if (finished && !visible) setRendered(false);
    });
    return () => animation.stop();
  }, [visible, anim]);

  const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] });

  return (
    <Modal visible={rendered} transparent animationType="none" onRequestClose={onRequestClose}>
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { backgroundColor: dimColor, opacity: anim }]}
      />
      <Animated.View style={[styles.content, { opacity: anim, transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
