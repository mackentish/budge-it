import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Modal } from '..';
import { colors, font } from '../../constants/globalStyle';

export function ConfirmDeleteGroup({
  isOpen,
  close,
  deleteFn,
}: {
  isOpen: boolean;
  close: () => void;
  deleteFn: () => void;
}) {
  return (
    <Modal visible={isOpen}>
      <View style={styles.container}>
        <Text style={styles.header}>Are you sure you want to delete this group?</Text>
        <Text style={styles.message}>
          Pockets within this group will NOT be deleted. They will be shown with the rest of your
          non-group pockets.
        </Text>
        <Button size="medium" type="secondary" label="Cancel" onPress={close} />
        <Button size="medium" label="Delete" onPress={deleteFn} style={styles.deleteBtn} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    fontSize: 20,
    fontFamily: font.bold,
    color: colors.temp.black,
    alignSelf: 'center',
  },
  message: {
    fontSize: 16,
    fontFamily: font.regular,
    color: colors.temp.black,
    alignSelf: 'center',
  },
  btnContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  deleteBtn: {
    backgroundColor: colors.temp.red,
    borderColor: colors.temp.red,
  },
});
