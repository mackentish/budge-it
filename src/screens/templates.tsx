import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, font } from '../constants/globalStyle';

export function Templates() {
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Templates</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
    backgroundColor: colors.temp.gray,
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: colors.temp.gray,
    flex: 1,
    padding: 30,
  },
  headerText: {
    fontSize: 20,
    fontFamily: font.regular,
    color: colors.temp.black,
  },
});
