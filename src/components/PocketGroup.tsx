import React, { useEffect, useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, Text, View } from 'react-native';

import { AnimatedChevron } from './AnimatedChevron';
import { Icon } from './Icon';
import { Pocket } from './Pocket';
import { colors, font, numbers } from '../constants/globalStyle';
import { useGroups, usePockets } from '../state/queries';
import { PocketGroup as PocketGroupType } from '../types';
import { currencyFormatter } from '../utils';
import { ConfirmDeleteGroup } from '../modals/ConfirmDeleteGroup';

export function PocketGroup({ group }: { group: PocketGroupType }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { deleteGroup } = useGroups();
  const { fetchPockets } = usePockets();

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [isOpen]);

  return (
    <View style={styles.container}>
      <Pressable onPress={() => setIsOpen(!isOpen)} style={styles.header}>
        <View style={styles.title}>
          <Icon name="group" style={styles.icon} />
          <Text style={styles.name}>{group.name}</Text>
        </View>
        <View style={styles.headerGroup}>
          <Text style={styles.amount}>
            {currencyFormatter.format(group.pockets.reduce((acc, curr) => acc + curr.amount, 0))}
          </Text>
          <AnimatedChevron chevronUp={isOpen} color={colors.temp.white} />
        </View>
      </Pressable>
      {isOpen && (
        <View style={styles.pockets}>
          {group.pockets.map(pocket => (
            <Pocket key={pocket.id} pocket={pocket} />
          ))}
          <Pressable style={styles.deleteBtn} onPress={() => setIsConfirmOpen(true)}>
            <Text style={styles.btnText}>Delete Group</Text>
          </Pressable>
        </View>
      )}
      <ConfirmDeleteGroup
        isOpen={isConfirmOpen}
        close={() => setIsConfirmOpen(false)}
        deleteFn={() => {
          deleteGroup.mutate(group.id, {
            onSuccess: () => fetchPockets.refetch(),
          });
          setIsConfirmOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: colors.temp.black,
    justifyContent: 'center',
    borderRadius: numbers.borderRadius.medium,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },
  icon: {
    color: colors.temp.white,
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pockets: {
    flexDirection: 'column',
    gap: 10,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  title: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: colors.temp.white,
    fontSize: 16,
    fontFamily: font.regular,
  },
  amount: {
    color: colors.temp.white,
    fontSize: 20,
    fontFamily: font.bold,
  },
  deleteBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.temp.red,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: numbers.borderRadius.medium,
  },
  btnText: {
    color: colors.temp.white,
    fontFamily: font.bold,
    fontSize: 16,
  },
});
