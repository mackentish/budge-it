import { Portal } from '@gorhom/portal';
import React, { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from './Icon';
import { AnimatedChevron } from './AnimatedChevron';
import { colors, font, numbers } from '../constants/globalStyle';
import { DropdownOption } from '../types';

export function Dropdown({
  label,
  placeholder,
  options,
  value,
  setValue,
  topOption,
}: {
  label?: string;
  placeholder: string;
  options: DropdownOption[];
  value: DropdownOption | undefined;
  setValue: Dispatch<SetStateAction<DropdownOption | undefined>>;
  topOption?: DropdownOption;
}) {
  // Determines if the dropdown is open or not
  const [isOpen, setIsOpen] = useState(false);
  // This gives us the position of the input in the window
  const [measure, setMeasure] = useState({ x: 0, y: 0, width: 0, height: 0 });
  // This tells us if we can render the dropdown above the input (default behavior because of the keyboard)
  const [canRenderAbove, setCanRenderAbove] = useState(true);
  // This is the filtered list of options based on the search text
  const [filteredOptions, setFilteredOptions] = useState<DropdownOption[]>(options);
  const inputRef = useRef<View>(null);
  const { top } = useSafeAreaInsets();

  function isSelected(option: DropdownOption) {
    return value?.value === option.value;
  }

  function filterOptions(searchText: string) {
    setFilteredOptions(
      options.filter(o => o.isHeader || o.label.toLowerCase().includes(searchText.toLowerCase())),
    );
  }

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (!isOpen) {
      setFilteredOptions(options);
    }
  }, [isOpen, options]);

  return (
    <View style={styles.inputGroup}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        ref={inputRef}
        onPress={() => {
          if (inputRef.current) {
            inputRef.current.measureInWindow((x, y, width, height) => {
              setMeasure({ x, y, width, height });
              // Calculate if we have enough space to render the dropdown above the input
              // if at all possible. If not, we'll render it below.
              // 220 is the height of the dropdown, 8 is the gap
              setCanRenderAbove(y > 220 + 8 + top);
            });
          }
          setIsOpen(!isOpen);
        }}
        style={[styles.input, isOpen && styles.open]}
      >
        {isOpen ? (
          <TextInput
            style={styles.text}
            autoFocus
            onChangeText={filterOptions}
            onSubmitEditing={() => {
              setValue(filteredOptions.filter(o => !o.isHeader)[0]);
              setIsOpen(false);
            }}
          />
        ) : (
          <Text style={value ? styles.text : styles.placeholder}>
            {value?.label || placeholder}
          </Text>
        )}
        <AnimatedChevron chevronUp={isOpen} />
      </Pressable>
      {isOpen && (
        <Portal>
          <View
            style={[
              styles.options,
              {
                left: measure.x,
                width: measure.width,
              },
              canRenderAbove
                ? {
                    bottom: Dimensions.get('window').height - measure.y + 8,
                  }
                : {
                    top: measure.y + measure.height + 8,
                  },
            ]}
          >
            <ScrollView style={styles.scroll}>
              {topOption && (
                <Pressable
                  onPress={() => {
                    if (isSelected(topOption)) setValue(undefined);
                    else setValue(topOption);
                    setIsOpen(false);
                  }}
                  style={[styles.topOption, isSelected(topOption) && styles.selected]}
                >
                  <Text style={styles.selectableText}>{topOption.label}</Text>
                  {isSelected(topOption) && <Icon name="check" style={styles.icon} />}
                </Pressable>
              )}
              {filteredOptions.map((o, i) => {
                return o.isHeader ? (
                  <View key={i} style={styles.header}>
                    <Text style={styles.headerText}>{o.label}</Text>
                  </View>
                ) : (
                  <Pressable
                    key={i}
                    onPress={() => {
                      if (isSelected(o)) setValue(undefined);
                      else setValue(o);
                      setIsOpen(false);
                    }}
                    style={[styles.selectable, isSelected(o) && styles.selected]}
                  >
                    <Text style={styles.selectableText}>{o.label}</Text>
                    {isSelected(o) && <Icon name="check" style={styles.icon} />}
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </Portal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontFamily: font.regular,
    color: colors.temp.darkGray,
  },
  input: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.temp.white,
    borderWidth: 1,
    borderColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  open: {
    borderColor: colors.temp.darkGray,
  },
  text: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: colors.temp.black,
  },
  placeholder: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.temp.midGray,
  },
  icon: {
    fontSize: 14,
    color: colors.temp.midGray,
  },
  options: {
    position: 'absolute',
    flexDirection: 'column',
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.temp.midGray,
  },
  scroll: {
    maxHeight: 220,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  headerText: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: colors.temp.black,
  },
  selectable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 24,
    paddingRight: 14,
  },
  selected: {
    backgroundColor: colors.temp.lightGray,
  },
  selectableText: {
    fontSize: 14,
    fontFamily: font.regular,
    color: colors.temp.black,
  },
  topOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 3,
    borderBottomColor: colors.temp.midGray,
  },
});
