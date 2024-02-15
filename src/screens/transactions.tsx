import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import TransactionNavigator from '../navigation/TransactionNavigator';

export function Transactions() {
  // TODO: add more stuff to the screen other than adding a transaction?
  // otherwise, remove this screen and use the TransactionNavigator directly
  // within the TabNavigator
  return (
    <SafeAreaView style={styles.safeArea}>
      <TransactionNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
