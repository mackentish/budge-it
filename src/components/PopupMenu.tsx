import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, IconNames } from './Icon';
import { colors, font, numbers } from '../constants/globalStyle';
import { OverlayContext } from '../state/context';

interface Option {
  label: string;
  icon: IconNames;
  action: () => void;
  color?: string;
}

export function PopupMenu({ options }: { options: Option[] }) {
  const { setShowOverlay } = useContext(OverlayContext);
  const { top } = useSafeAreaInsets();

  return (
    <Menu onClose={() => setShowOverlay(false)} onOpen={() => setShowOverlay(true)}>
      <MenuTrigger>
        <Icon name={IconNames.Dot3} style={styles.icon} />
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            marginTop: top,
            backgroundColor: colors.temp.white,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: numbers.borderRadius.medium,
          },
          optionWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          },
        }}
      >
        {options.map((o, i) => (
          <View key={i}>
            <MenuOption onSelect={o.action}>
              <Text style={[styles.text, o.color ? { color: o.color } : {}]}>{o.label}</Text>
              <Icon name={o.icon} style={[styles.icon, o.color && { color: o.color }]} />
            </MenuOption>
            {i < options.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </MenuOptions>
    </Menu>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: font.regular,
    fontSize: 16,
    color: colors.temp.black,
  },
  divider: {
    height: 1,
    backgroundColor: colors.temp.gray,
  },
  icon: {
    color: colors.temp.black,
    fontSize: 24,
  },
});
