import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedPressable } from '../components';
import { colors, font } from '../constants/globalStyle';
import { UserContext } from '../state/context';

/**
 * Default page for user settings. User has access to other screens from here
 */
export function Profile() {
  const { setUser } = useContext(UserContext);
  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <Text style={styles.headerText}>User Settings</Text>
        <AnimatedPressable style={styles.signOutBtn} onPress={() => setUser(undefined)}>
          <Text style={styles.btnText}>Sign Out</Text>
        </AnimatedPressable>
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
    gap: 16,
    backgroundColor: colors.temp.gray,
    flex: 1,
    padding: 30,
  },
  headerText: {
    fontSize: 20,
    fontFamily: font.regular,
    color: colors.temp.black,
  },
  btnText: {
    fontSize: 15,
    fontFamily: font.semiBold,
    color: colors.temp.white,
  },
  signOutBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.temp.red,
  },
});
