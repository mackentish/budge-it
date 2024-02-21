import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PopupMenu } from './PopupMenu';
import { EditPocket } from './EditPocket';
import { colors, font, numbers } from '../constants/globalStyle';
import { Pocket as PocketType } from '../types';
import { currencyFormatter } from '../utils';
import { AddToGroupModal } from '../modals/AddToGroupModal';
import { DeletePocketModal } from '../modals/DeletePocketModal';
import { IconNames } from './Icon';

export function Pocket({ pocket }: { pocket: PocketType }) {
  // delete pocket
  const [deleteOpen, setDeleteOpen] = useState(false);
  // edit pocket
  const [isEditing, setIsEditing] = useState(false);
  // add to group
  const [addToGroupOpen, setAddToGroupOpen] = useState(false);

  const pocketMenuOptions = [
    {
      label: 'Rename',
      icon: IconNames.Edit,
      action: () => setIsEditing(true),
    },
    ...(!pocket.groupId
      ? [
          {
            label: 'Add to group',
            icon: IconNames.Plus,
            action: () => setAddToGroupOpen(true),
          },
        ]
      : []),
    {
      label: 'Delete',
      icon: IconNames.Trash,
      action: () => setDeleteOpen(true),
      color: colors.temp.red,
    },
  ];

  if (isEditing) {
    return <EditPocket pocket={pocket} close={() => setIsEditing(false)} />;
  }
  return (
    <View style={styles.pocketRow}>
      <View style={styles.pocketInfo}>
        <Text style={styles.name}>{pocket.name}</Text>
        <Text style={[styles.amount, pocket.amount < 0 && styles.negativeAmount]}>
          {currencyFormatter.format(pocket.amount)}
        </Text>
      </View>
      <PopupMenu options={pocketMenuOptions} />
      <DeletePocketModal isOpen={deleteOpen} setIsOpen={setDeleteOpen} pocket={pocket} />
      <AddToGroupModal isOpen={addToGroupOpen} setIsOpen={setAddToGroupOpen} pocket={pocket} />
    </View>
  );
}

const styles = StyleSheet.create({
  pocketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
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
  icon: {
    fontSize: 24,
    color: colors.temp.black,
  },
});
