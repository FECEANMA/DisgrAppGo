import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';

interface Props {
  children: React.ReactNode;
}

export default function ScreenWrapper({ children }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
    >
      <View style={styles.blueOverlay} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 80, 180, 0.25)',
  },
});
