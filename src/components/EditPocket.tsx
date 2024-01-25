import React, { useState } from 'react';
import { Alert, StyleSheet, TextInput, View } from 'react-native';

import { Button } from './Button';
import { colors, font, numbers } from '../constants/globalStyle';
import { useGroups, usePockets } from '../state/queries';
import { Pocket } from '../types';

export function EditPocket({ pocket, close }: { pocket: Pocket; close: () => void }) {
  const [newName, setNewName] = useState(pocket.name);
  const { updatePocket } = usePockets();
  const { fetchGroups } = useGroups();

  return (
    <View style={styles.container}>
      <TextInput
        value={newName}
        onChangeText={setNewName}
        autoFocus
        selectTextOnFocus
        multiline
        style={styles.input}
      />
      <Button size="small" type="secondary" label="Cancel" onPress={close} />
      <Button
        size="small"
        type="primary"
        label="Done"
        onPress={() => {
          updatePocket.mutate(
            { ...pocket, name: newName },
            {
              onSuccess: () => {
                fetchGroups.refetch();
                close();
              },
              onError: () => Alert.alert('Error updating pocket'),
            },
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.temp.gray,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.temp.black,
    borderStyle: 'dashed',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 16,
    borderRadius: numbers.borderRadius.medium,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlign: 'justify',
    color: colors.temp.black,
    fontFamily: font.regular,
    fontSize: 16,
  },
});
