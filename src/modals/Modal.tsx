import React from 'react';
import { Modal as ReactModal, StyleSheet, View } from 'react-native';

import { colors, numbers } from '../constants/globalStyle';

export function Modal({ visible, children }: { visible: boolean; children: React.ReactNode }) {
  return (
    <ReactModal
      animationType="slide"
      transparent={true}
      visible={visible}
      style={styles.centeredView}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>{children}</View>
      </View>
    </ReactModal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalView: {
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.large,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
});
