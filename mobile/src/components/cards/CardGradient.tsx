import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, ViewStyle } from 'react-native';
import { CardDesign } from '../../types';

interface CardGradientProps {
  design: CardDesign;
  style?: ViewStyle;
  children: React.ReactNode;
}

export default function CardGradient({ design, style, children }: CardGradientProps) {
  return (
    <LinearGradient
      colors={design.colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 24,
    overflow: 'hidden',
  },
});
