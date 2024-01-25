import React, { Dispatch, SetStateAction } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { colors } from '../constants/globalStyle';
import { currencyFormatter } from '../utils';

export function CurrencyInput(
  props: TextInputProps & { value: string; setValue: Dispatch<SetStateAction<string>> },
) {
  const onAmountChange = (text: string) => {
    // don't allow more than one decimal
    const splitText = text.split('.');
    if (splitText.length > 2) {
      return;
    }
    // don't allow more than two decimal places
    if (splitText.length > 1 && splitText[1].length > 2) {
      return;
    }
    props.setValue(text);
  };
  const onAmountBlur = () => {
    try {
      // remove all non-numeric characters and split on decimal
      const splitText = props.value.replace(/[^0-9.]/g, '').split('.');
      let newText = splitText[0];
      // if there is a decimal, add it back
      if (splitText.length > 1) {
        newText += '.' + splitText[1].slice(0, 2);
      }
      // if there is no decimal, add one
      else {
        newText += '.00';
      }
      props.setValue(currencyFormatter.format(Number(newText)));
    } catch (err) {
      console.log(err);
      props.setValue('$0.00');
    }
  };
  return (
    <TextInput
      {...props}
      clearTextOnFocus
      onBlur={onAmountBlur}
      onChangeText={onAmountChange}
      keyboardType="numeric"
      value={props.value}
      style={[props.style, props.value === '$0.00' && styles.placeholder]}
      autoCorrect={false}
      spellCheck={false}
    />
  );
}

const styles = StyleSheet.create({
  placeholder: {
    color: colors.temp.midGray,
  },
});
