import { useBottomSheet } from '@gorhom/bottom-sheet';
import React, { useState } from 'react';
import { Alert, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { Button } from '../../components/Button';
import { Icon, IconNames } from '../../components/Icon';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Modal } from '../../modals/Modal';
import { colors, font, numbers } from '../../constants/globalStyle';
import { useGroups, usePockets } from '../../state/queries';
import { Pocket } from '../../types';
import { currencyFormatter } from '../../utils';

function GroupPocket({
  name,
  amount,
  onPress,
}: {
  name: string;
  amount: number;
  onPress: () => void;
}) {
  return (
    <View style={pocketStyles.pocket}>
      <View style={pocketStyles.pocketRow}>
        <View style={pocketStyles.pocketInfo}>
          <Text style={pocketStyles.name}>{name}</Text>
          <Text style={[pocketStyles.amount, amount < 0 && pocketStyles.negativeAmount]}>
            {currencyFormatter.format(amount)}
          </Text>
        </View>
        <Pressable onPress={onPress}>
          <Icon name={IconNames.X} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

function PocketOption({
  name,
  amount,
  disabled,
  onPress,
}: {
  name: string;
  amount: number;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[pocketOptionStyles.pocketOption, disabled && pocketOptionStyles.disabled]}
      onPress={onPress}
    >
      <View style={pocketStyles.pocketInfo}>
        <Text style={pocketOptionStyles.name}>{name}</Text>
        <Text style={[pocketOptionStyles.amount, amount < 0 && pocketStyles.negativeAmount]}>
          {currencyFormatter.format(amount)}
        </Text>
      </View>
      <Icon name={IconNames.Plus} style={styles.icon} />
    </Pressable>
  );
}

export function AddGroup() {
  const { close } = useBottomSheet();
  const [groupName, setGroupName] = useState('');
  const [note, setNote] = useState('');
  const [groupPockets, setGroupPockets] = useState<Pocket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { fetchGroups, createGroup } = useGroups();
  const { fetchPockets } = usePockets();
  const pockets = fetchPockets.data?.filter(p => !p.groupId) ?? [];

  // only name and at least one pocket is required
  const isValid = groupName.length > 0 && groupPockets.length > 0;

  const closeAndReset = () => {
    setGroupName('');
    setNote('');
    setGroupPockets([]);
    Keyboard.dismiss();
    close();
  };

  const onSave = () => {
    createGroup.mutate(
      {
        name: groupName,
        note: note ? note : undefined,
        pockets: groupPockets,
      },
      {
        onSuccess: () => {
          fetchGroups.refetch();
          fetchPockets.refetch();
          closeAndReset();
        },
        onError: () => Alert.alert('Could not create group.'),
      },
    );
  };

  const removePocket = (id: string) => {
    setGroupPockets(groupPockets.filter(p => p.id !== id));
  };

  if (fetchPockets.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={closeAndReset} style={styles.closeBtn}>
        <Icon name={IconNames.X} style={styles.icon} />
      </Pressable>
      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder="New Pocket Group"
        style={styles.nameInput}
        spellCheck
      />
      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Note</Text>
          <Text style={styles.labelLight}> - first 20 characters will be shown as subtitle</Text>
        </View>
        <TextInput
          value={note}
          onChangeText={setNote}
          placeholder="Ex: Tahoe trip expenses."
          style={styles.input}
          spellCheck
        />
      </View>
      {groupPockets.length > 0 && (
        <View style={styles.addedPockets}>
          <View style={styles.totalRow}>
            <Text style={styles.header}>Total</Text>
            <Text style={styles.header}>
              {currencyFormatter.format(
                groupPockets.reduce((total, { amount }) => total + amount, 0),
              )}
            </Text>
          </View>
          {groupPockets.map(p => (
            <GroupPocket
              key={p.id}
              name={p.name}
              amount={p.amount}
              onPress={() => removePocket(p.id)}
            />
          ))}
        </View>
      )}
      <Button type="secondary" label="Add Pockets" onPress={() => setShowModal(true)} />
      <Modal visible={showModal}>
        <View style={modalStyles.modal}>
          <ScrollView style={modalStyles.scrollView}>
            <View style={modalStyles.pocketContainer}>
              {pockets.map(p => (
                <PocketOption
                  key={p.id}
                  name={p.name}
                  amount={p.amount}
                  disabled={groupPockets.some(gp => gp.id === p.id)}
                  onPress={() => {
                    if (groupPockets.some(gp => gp.id === p.id)) {
                      // if pocket is already in group, remove it
                      setGroupPockets(groupPockets.filter(gp => gp.id !== p.id));
                    } else {
                      setGroupPockets([...groupPockets, p]);
                    }
                  }}
                />
              ))}
            </View>
          </ScrollView>
          <Button label="Done" onPress={() => setShowModal(false)} />
        </View>
      </Modal>
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
    fontSize: 24,
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
    fontFamily: font.medium,
  },
  labelLight: {
    fontSize: 13,
    fontFamily: font.medium,
    color: colors.temp.darkGray,
  },
  addedPockets: {
    flexDirection: 'column',
    gap: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontFamily: font.bold,
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
  gap: {
    flex: 1,
  },
});

const pocketStyles = StyleSheet.create({
  pocket: {
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    padding: 16,
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.medium,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },
  pocketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    alignSelf: 'stretch',
  },
  pocketInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  name: {
    color: colors.temp.black,
    fontFamily: font.regular,
    fontSize: 16,
  },
  amount: {
    color: colors.temp.black,
    fontFamily: font.bold,
    fontSize: 20,
  },
  negativeAmount: {
    color: colors.temp.red,
  },
});

const modalStyles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  modal: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  scrollView: {
    backgroundColor: colors.temp.gray,
    borderRadius: numbers.borderRadius.small,
    maxHeight: 300,
  },
  pocketContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 8,
  },
});

const pocketOptionStyles = StyleSheet.create({
  pocketOption: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.medium,
    padding: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  name: {
    color: colors.temp.black,
    fontFamily: font.regular,
    fontSize: 14,
  },
  amount: {
    color: colors.temp.black,
    fontFamily: font.bold,
    fontSize: 16,
  },
});
