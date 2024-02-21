import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Icon, IconNames } from './Icon';
import { colors, font, numbers } from '../constants/globalStyle';

export function Selected({ tagName, onPress }: { tagName: string; onPress: () => void }) {
  return (
    <Pressable style={styles.tag} onPress={onPress}>
      <Text style={styles.tagName}>{tagName}</Text>
      <Icon name={IconNames.X} style={styles.x} />
    </Pressable>
  );
}

export function Available({ tagName, onPress }: { tagName: string; onPress: () => void }) {
  return (
    <Pressable style={styles.tag} onPress={onPress}>
      <Text style={styles.tagName}>{tagName}</Text>
      <Icon name={IconNames.Plus} style={styles.plus} />
    </Pressable>
  );
}

export function Add({ createFn }: { createFn: (tag: string) => void }) {
  const [newTagName, setNewTagName] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);

  if (isCreating) {
    return (
      <View style={styles.createTag}>
        <TextInput
          style={styles.createTagText}
          placeholder="Enter Name"
          value={newTagName}
          onChangeText={setNewTagName}
          autoFocus
          autoCorrect={false}
          spellCheck={false}
        />
        {newTagName ? (
          <Pressable
            onPress={() => {
              createFn(newTagName);
              setIsCreating(false);
              setNewTagName('');
            }}
          >
            <Icon name={IconNames.Check} style={styles.check} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setIsCreating(false);
              setNewTagName('');
            }}
          >
            <Icon name={IconNames.X} style={styles.xBlack} />
          </Pressable>
        )}
      </View>
    );
  } else {
    return (
      <Pressable style={styles.createTag} onPress={() => setIsCreating(true)}>
        <Text style={styles.createTagText}>New Tag</Text>
        <Icon name={IconNames.Edit} style={styles.edit} />
      </Pressable>
    );
  }
}

export function Edit({
  tagName,
  updateFn,
}: {
  tagName: string;
  updateFn: (oldName: string, newName: string) => void;
}) {
  const [newTagName, setNewTagName] = useState<string>(tagName);
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <View style={styles.createTag}>
        <TextInput
          style={styles.createTagText}
          placeholder="Enter Name"
          value={newTagName}
          onChangeText={setNewTagName}
          autoFocus
          autoCorrect={false}
          spellCheck={false}
        />
        {newTagName && (
          <Pressable
            onPress={() => {
              updateFn(tagName, newTagName);
              setIsEditing(false);
            }}
          >
            <Icon name={IconNames.Check} style={styles.check} />
          </Pressable>
        )}
        <Pressable
          onPress={() => {
            setIsEditing(false);
            setNewTagName(tagName);
          }}
        >
          <Icon name={IconNames.X} style={styles.xBlack} />
        </Pressable>
      </View>
    );
  } else {
    return (
      <Pressable style={styles.tag} onPress={() => setIsEditing(true)}>
        <Text style={styles.tagName}>{tagName}</Text>
        <Icon name={IconNames.Edit} style={styles.editWhite} />
      </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: colors.temp.black,
    borderWidth: 1,
    borderColor: colors.temp.black,
    borderRadius: numbers.borderRadius.small,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagName: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: colors.temp.white,
  },
  createTag: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.temp.black,
    borderStyle: 'dashed',
    borderRadius: numbers.borderRadius.small,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  createTagText: {
    fontSize: 16,
    fontFamily: font.semiBold,
    color: colors.temp.black,
  },
  x: {
    fontSize: 20,
    color: colors.temp.white,
  },
  xBlack: {
    fontSize: 20,
    color: colors.temp.black,
  },
  plus: {
    fontSize: 22,
    color: colors.temp.white,
  },
  edit: {
    fontSize: 16,
    color: colors.temp.black,
  },
  editWhite: {
    fontSize: 17,
    color: colors.temp.white,
  },
  check: {
    fontSize: 18,
    color: colors.temp.black,
  },
});
