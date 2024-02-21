import { NavigationProp } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { Icon, IconNames } from '../../components/Icon';
import * as Tag from '../../components/Tag';
import { colors, font, numbers } from '../../constants/globalStyle';
import { TransactionStackParams } from '../../navigation/TransactionNavigator';
import { TransactionContext, UserContext } from '../../state/context';
import { useUser } from '../../state/queries';

type Props = {
  navigation: NavigationProp<TransactionStackParams, 'selectTags'>;
};

export function SelectTags({ navigation }: Props) {
  const { transactionTags, setTransactionTags } = useContext(TransactionContext);

  const { user } = useContext(UserContext);
  const { createUserTag, updateUserTag } = useUser();
  const [availableTags, setAvailableTags] = useState<string[]>(
    (user?.tags || []).filter(tag => !transactionTags.includes(tag)),
  );

  const [tempTags, setTempTags] = useState<string[]>(transactionTags);
  const [isEditing, setIsEditing] = useState(false);

  function createTag(newTagName: string) {
    // check if there is already a tag with this name
    if (
      [...availableTags, ...tempTags].find(tag => tag.toLowerCase() === newTagName.toLowerCase())
    ) {
      Alert.alert('Tag already exists');
      return;
    } else {
      createUserTag.mutate(newTagName);
      setTempTags([...tempTags, newTagName]);
    }
  }

  function saveTags() {
    setTransactionTags(tempTags);
    navigation.navigate('addTransaction');
  }

  function updateTag(oldTagName: string, newTagName: string) {
    // check if there is already a tag with this name
    if (
      [...availableTags, ...tempTags].find(tag => tag.toLowerCase() === newTagName.toLowerCase())
    ) {
      Alert.alert(`Tag '${newTagName}' already exists`);
      return;
    } else {
      updateUserTag.mutate(
        { oldTag: oldTagName, newTag: newTagName },
        {
          onSuccess: () => {
            setTempTags(tempTags.map(tag => (tag === oldTagName ? newTagName : tag)));
            setAvailableTags(availableTags.map(tag => (tag === oldTagName ? newTagName : tag)));
          },
        },
      );
    }
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Icon name={IconNames.ChevronLeft} style={styles.chevron} />
        <Text style={styles.backBtnTxt}>Back</Text>
      </Pressable>

      <Text style={styles.header}>Tags</Text>

      <View style={styles.tagGroup}>
        <Text style={styles.label}>Selected Tags</Text>
        <View style={styles.tagContainer}>
          {tempTags.map(tag => (
            <Tag.Selected
              key={tag}
              tagName={tag}
              onPress={() => {
                setTempTags(tempTags.filter(t => t !== tag));
                setAvailableTags([...availableTags, tag]);
              }}
            />
          ))}
          <Tag.Add createFn={createTag} />
        </View>
      </View>

      <View style={styles.tagGroup}>
        <View style={styles.row}>
          <Text style={styles.label}>Available Tags</Text>
          <Pressable onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.text}>{isEditing ? 'Done' : 'Edit'}</Text>
          </Pressable>
        </View>
        <View style={styles.tagContainer}>
          {availableTags.length ? (
            availableTags.map(tag => (
              <View key={tag}>
                {isEditing ? (
                  <Tag.Edit tagName={tag} updateFn={updateTag} />
                ) : (
                  <Tag.Available
                    tagName={tag}
                    onPress={() => {
                      setAvailableTags(availableTags.filter(t => t !== tag));
                      setTempTags([...tempTags, tag]);
                    }}
                  />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noTagsText}>
              No available tags, create one to add it to your transaction.
            </Text>
          )}
        </View>
      </View>

      <View style={styles.flex} />
      <Button label="Save Tags" onPress={saveTags} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 10,
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  backBtnTxt: {
    fontSize: 18,
    fontFamily: font.semiBold,
    color: colors.temp.black,
  },
  chevron: {
    fontSize: 18,
    color: colors.temp.black,
  },
  flex: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontFamily: font.bold,
    alignSelf: 'center',
  },
  tagGroup: {
    flexDirection: 'column',
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: font.regular,
    color: colors.temp.black,
  },
  label: {
    fontSize: 16,
    fontFamily: font.bold,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 10,
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
  },
  noTagsText: {
    fontSize: 14,
    fontFamily: font.italic,
    color: colors.temp.darkGray,
  },
});
