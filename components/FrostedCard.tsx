import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { colors, radius, spacing, shadow } from '../styles/theme';

interface FrostedCardProps extends ViewProps {
  padding?: number;
}

export default function FrostedCard({ style, children, padding = spacing.lg, ...rest }: FrostedCardProps) {
  // Try expo-blur; gracefully fallback if not available
  let BlurViewComp: any = null;
  try {
    const pkg = 'expo-blur';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { BlurView } = require(pkg);
    BlurViewComp = BlurView;
  } catch (e) {
    // no-op; fallback below
  }

  const content = (
    <View style={[styles.inner, { padding }]}>
      {children}
    </View>
  );

  if (BlurViewComp) {
    return (
      <View style={[styles.wrapper, shadow.card, style]} {...rest}>
        <BlurViewComp intensity={25} tint="light" style={StyleSheet.absoluteFill} />
        {content}
      </View>
    );
  }

  // Fallback: semi-transparent surface with border and shadow
  return (
    <View style={[styles.wrapper, styles.fallback, shadow.card, style]} {...rest}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  fallback: {
    // a touch more opaque for non-blur case
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  inner: {
    // spacing is provided via prop default
  },
});