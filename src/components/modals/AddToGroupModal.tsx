import BottomSheet from '@gorhom/bottom-sheet';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Icon, Modal, Sheet } from '..';
import { colors, font, numbers } from '../../constants/globalStyle';
import { AddGroup } from '../../screens/sheets';
import { useGroups, usePockets } from '../../state/queries';
import { Pocket } from '../../types';

export function AddToGroupModal({
  isOpen,
  setIsOpen,
  pocket,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  pocket: Pocket;
}) {
  const { fetchGroups } = useGroups();
  const { updatePocket } = usePockets();
  const [selectedGroup, setSelectedGroup] = useState('');
  const newGroupSheet = useRef<BottomSheet>(null);

  return (
    <>
      <Modal visible={isOpen}>
        <View style={styles.container}>
          <Pressable onPress={() => setIsOpen(false)} style={styles.closeBtn}>
            <Icon name="x" style={styles.icon} />
          </Pressable>
          <Text style={styles.header}>Add to Group</Text>
          {fetchGroups.data ? (
            <ScrollView style={styles.scroll}>
              <View style={styles.groupsContainer}>
                {fetchGroups.data.map(g => (
                  <Pressable
                    key={g.id}
                    onPress={() => {
                      if (selectedGroup === g.id) {
                        setSelectedGroup('');
                      } else {
                        setSelectedGroup(g.id);
                      }
                    }}
                    style={[styles.group, selectedGroup === g.id && styles.selected]}
                  >
                    <Icon name="group" style={styles.groupIcon} />
                    <Text style={styles.groupName}>{g.name}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          ) : (
            <Text style={styles.message}>
              You don't have any pocket groups yet. Create one now!
            </Text>
          )}
          <Button
            size="medium"
            type="secondary"
            label="Create New Pocket Group"
            onPress={() => {
              setIsOpen(false);
              newGroupSheet.current?.expand();
            }}
          />
          {fetchGroups.data && (
            <Button
              size="medium"
              label="Add to Pocket Group"
              onPress={() => {
                updatePocket.mutate(
                  { ...pocket, groupId: selectedGroup },
                  {
                    onSuccess: () => {
                      fetchGroups.refetch();
                      setIsOpen(false);
                      setSelectedGroup('');
                    },
                    onError: () => Alert.alert('Error updating pocket'),
                  },
                );
              }}
              disabled={!selectedGroup}
            />
          )}
        </View>
      </Modal>
      <Sheet
        bottomSheetRef={newGroupSheet}
        closeFn={() => {
          if (!pocket.groupId) {
            setIsOpen(true);
          }
        }}
      >
        <AddGroup />
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  icon: {
    fontSize: 16,
    color: colors.temp.darkGray,
  },
  header: {
    fontFamily: font.bold,
    fontSize: 24,
    color: colors.temp.black,
    alignSelf: 'center',
  },
  message: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.temp.black,
    alignSelf: 'center',
    marginBottom: 10,
  },
  container: {
    flexDirection: 'column',
    gap: 20,
  },
  scroll: {
    maxHeight: 500,
    minHeight: 200,
  },
  groupsContainer: {
    flexDirection: 'column',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
    padding: 5,
  },
  selected: {
    borderColor: colors.temp.lightGreen,
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    backgroundColor: colors.temp.black,
    borderWidth: 2,
    borderRadius: numbers.borderRadius.medium,
    borderColor: colors.temp.black,
  },
  groupIcon: {
    fontSize: 20,
    color: colors.temp.white,
  },
  groupName: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.temp.white,
  },
});
