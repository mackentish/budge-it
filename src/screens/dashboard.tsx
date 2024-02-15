import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import { RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { LoadingSpinner, Pocket, PocketGroup, PopupMenu, Sheet } from '../components';
import { colors, font } from '../constants/globalStyle';
import TransactionNavigator from '../navigation/TransactionNavigator';
import { useGroups, usePockets } from '../state/queries';
import { AddGroup, AddPocket } from './sheets';

export function Dashboard() {
  const { fetchGroups } = useGroups();
  const { fetchPockets } = usePockets();
  const groups = fetchGroups.data || [];
  const pockets = fetchPockets.data || [];
  const isLoading = fetchPockets.isLoading || fetchGroups.isLoading;
  // BottomSheets
  const addPocketSheet = useRef<BottomSheet>(null);
  const addGroupSheet = useRef<BottomSheet>(null);

  if (fetchPockets.isError || fetchGroups.isError) {
    return (
      <SafeAreaView style={styles.safeView}>
        <Text>{`Error loading ${fetchPockets.isError ? 'pockets' : 'groups'}`}</Text>
      </SafeAreaView>
    );
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeView}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  const onRefresh = () => {
    fetchGroups.refetch();
    fetchPockets.refetch();
  };

  const pocketMenuOptions = [
    {
      label: 'New Pocket',
      icon: 'plus',
      action: () => addPocketSheet.current?.expand(),
    },
    {
      label: 'New Group',
      icon: 'group',
      action: () => addGroupSheet.current?.expand(),
    },
  ];

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.container}>
        <ScrollView
          refreshControl={<RefreshControl onRefresh={onRefresh} refreshing={isLoading} />}
        >
          <View style={styles.pocketContainer}>
            <View style={styles.pocketTitleRow}>
              <Text style={styles.pocketTitle}>Pockets</Text>
              <PopupMenu options={pocketMenuOptions} />
            </View>
            {groups.map(g => (
              <PocketGroup key={g.id} group={g} />
            ))}
            {pockets
              .filter(p => !p.groupId)
              .map(p => (
                <Pocket key={p.id} pocket={p} />
              ))}
          </View>
        </ScrollView>
        <Sheet bottomSheetRef={addPocketSheet}>
          <AddPocket />
        </Sheet>
        <Sheet bottomSheetRef={addGroupSheet}>
          <AddGroup />
        </Sheet>
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
    backgroundColor: colors.temp.gray,
    flex: 1,
  },
  pocketContainer: {
    marginTop: 15,
    padding: 20,
    flexDirection: 'column',
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  pocketTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pocketTitle: {
    fontFamily: font.bold,
    fontSize: 22,
  },
  smBtnTxt: {
    fontSize: 12,
    fontFamily: font.regular,
  },
  icon: {
    fontSize: 24,
  },
});
