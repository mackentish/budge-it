import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { colors } from '../constants/globalStyle';

export function LoadingSpinner() {
  return (
    <View style={[styles.container, styles.loadingContainer]}>
      <ActivityIndicator size="large" color={colors.temp.lightGray} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: colors.temp.white,
  },
  loadingContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    padding: 10,
  },
});
