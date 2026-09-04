import { View } from 'react-native';

interface GearIconProps {
  size?: number;
  color?: string;
}

const SPOKE_ANGLES = [0, 45, 90, 135];

export default function GearIcon({ size = 20, color = '#c1541c' }: GearIconProps) {
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {SPOKE_ANGLES.map((deg) => (
        <View
          key={deg}
          style={{
            position: 'absolute',
            width: size,
            height: size * 0.22,
            borderRadius: size * 0.11,
            backgroundColor: color,
            transform: [{ rotate: `${deg}deg` }],
          }}
        />
      ))}
      <View
        style={{
          position: 'absolute',
          width: size * 0.5,
          height: size * 0.5,
          borderRadius: size * 0.25,
          backgroundColor: '#fff',
          borderWidth: size * 0.09,
          borderColor: color,
        }}
      />
    </View>
  );
}
