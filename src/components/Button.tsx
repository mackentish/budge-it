import React from 'react';
import { PressableProps, StyleSheet, Text } from 'react-native';

import { colors, font } from '../constants/globalStyle';
import { AnimatedPressable } from './AnimatedPressable';

export function Button({
  label,
  onPress,
  disabled = false,
  children,
  size = 'small',
  type = 'primary',
  style = {},
}: {
  label?: string;
  onPress: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary' | 'tertiary';
  style?: any;
} & PressableProps) {
  let buttonStyles = [];
  let textStyles = [];
  // assign size based styles
  switch (size) {
    case 'small':
      buttonStyles.push(defaultStyles.small);
      textStyles.push(defaultStyles.smallText);
      break;
    case 'medium':
      buttonStyles.push(defaultStyles.medium);
      textStyles.push(defaultStyles.mediumText);
      break;
    case 'large':
      buttonStyles.push(defaultStyles.large);
      textStyles.push(defaultStyles.largeText);
      break;
  }
  // assign type based styles
  switch (type) {
    case 'primary':
      buttonStyles.push(defaultStyles.primary);
      textStyles.push(defaultStyles.primaryText);
      break;
    case 'secondary':
      buttonStyles.push(defaultStyles.secondary);
      textStyles.push(defaultStyles.secondaryText);
      break;
    case 'tertiary':
      buttonStyles.push(defaultStyles.tertiary);
      textStyles.push(defaultStyles.tertiaryText);
      break;
  }
  buttonStyles.push(style);

  return (
    <AnimatedPressable
      disabled={disabled}
      onPress={onPress}
      style={[
        defaultStyles.button,
        buttonStyles,
        // eslint-disable-next-line react-native/no-inline-styles
        children ? { flex: 1, justifyContent: 'space-between' } : { justifyContent: 'center' },
      ]}
    >
      {label && <Text style={textStyles}>{label}</Text>}
      {children}
    </AnimatedPressable>
  );
}

const defaultStyles = StyleSheet.create({
  // button styles
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    //flex: 1, fixed tertiary with children but broke login buttons. Leaving here for now
  },
  small: {
    paddingHorizontal: 15,
  },
  medium: {
    paddingHorizontal: 24,
  },
  large: {
    paddingHorizontal: 30,
  },
  primary: {
    borderRadius: 16,
    backgroundColor: colors.temp.black,
    borderWidth: 1,
  },
  secondary: {
    borderRadius: 16,
    backgroundColor: 'transparent',
    borderColor: colors.temp.black,
    borderWidth: 1,
  },
  tertiary: {
    borderRadius: 10,
    backgroundColor: colors.temp.gray,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 1,
    elevation: 3,
  },

  // text styles
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 18,
  },
  largeText: {
    fontSize: 24,
  },
  primaryText: {
    color: colors.temp.white,
    fontFamily: font.semiBold,
  },
  secondaryText: {
    color: colors.temp.black,
    fontFamily: font.semiBold,
  },
  tertiaryText: {
    color: colors.temp.black,
    fontFamily: font.regular,
  },
});
