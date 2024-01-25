import { useBottomSheet } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Button, CurrencyInput, Dropdown, Icon, LoadingSpinner } from '../../components';
import { colors, font, numbers } from '../../constants/globalStyle';
import { useGroups, usePockets } from '../../state/queries';
import { DropdownOption } from '../../types';

export function AddPocket() {
  const { close } = useBottomSheet();
  const [pocketName, setPocketName] = useState('');
  const [startingAmount, setStartingAmount] = useState('$0.00');
  const [pocketGroup, setPocketGroup] = useState<DropdownOption | undefined>(undefined);
  const [note, setNote] = useState('');
  const { fetchGroups } = useGroups();
  const { fetchPockets, createPocket } = usePockets();

  if (fetchGroups.isLoading) {
    return <LoadingSpinner />;
  }

  const groupList = (fetchGroups.data || []).map(({ id, name }) => ({ value: id, label: name }));

  // Only name and amount are required. Amount can be 0
  const isValid = pocketName.length > 0 && !isNaN(Number(startingAmount.replace(/[^0-9.]/g, '')));

  const closeAndReset = () => {
    setPocketName('');
    setStartingAmount('$0.00');
    setPocketGroup(undefined);
    setNote('');
    Keyboard.dismiss();
    close();
  };

  const onSave = () => {
    const amount = Number(startingAmount.replace(/[^0-9.]/g, ''));
    createPocket.mutate(
      {
        name: pocketName,
        amount,
        groupId: pocketGroup ? pocketGroup.value : undefined,
        note: note.length > 0 ? note : undefined,
      },
      {
        onSuccess: () => {
          fetchPockets.refetch();
          fetchGroups.refetch();
          closeAndReset();
        },
        onError: () => Alert.alert('Error creating pocket'),
      },
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={closeAndReset} style={styles.closeBtn}>
        <Icon name="x" style={styles.icon} />
      </Pressable>
      <TextInput
        value={pocketName}
        onChangeText={setPocketName}
        placeholder="Pocket Name"
        style={styles.nameInput}
      />
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Starting Amount</Text>
        <CurrencyInput
          value={startingAmount}
          setValue={setStartingAmount}
          style={[styles.input, styles.amountInput]}
        />
      </View>
      {fetchGroups.data && fetchGroups.data.length > 0 && (
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pocket Group</Text>
          <Dropdown
            placeholder="Choose a pocket group"
            options={groupList}
            value={pocketGroup}
            setValue={setPocketGroup}
          />
        </View>
      )}
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.labelLight}> - first 20 characters will be shown as subtitle</Text>
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Ex: Use Jan-May to help pay off loan."
          style={styles.input}
        />
      </View>
      <View style={styles.gap} />
      <Button label="Save" onPress={onSave} disabled={!isValid} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 20,
    flex: 1,
    backgroundColor: colors.temp.gray,
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    left: 10,
  },
  icon: {
    fontSize: 18,
  },
  iconSm: {
    alignSelf: 'center',
    fontSize: 12,
    color: colors.temp.midGray,
  },
  inputGroup: {
    flexDirection: 'column',
    gap: 10,
  },
  nameInput: {
    fontSize: 22,
    fontFamily: font.bold,
    textAlign: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontFamily: font.regular,
  },
  labelLight: {
    fontSize: 13,
    fontFamily: font.regular,
    color: colors.temp.darkGray,
  },
  input: {
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.medium,
    borderColor: colors.temp.midGray,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: font.regular,
    fontSize: 16,
  },
  select: {
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.medium,
    borderWidth: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontFamily: font.regular,
    fontSize: 16,
  },
  selectInput: {
    fontFamily: font.regular,
    fontSize: 16,
  },
  dropDown: {
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
    borderWidth: 0,
  },
  amountInput: {
    fontFamily: font.bold,
  },
  gap: {
    flex: 1,
  },
});
