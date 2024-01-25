import { useBottomSheet } from '@gorhom/bottom-sheet';
import { NavigationProp } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AnimatedChevron,
  AnimatedPressable,
  Button,
  CurrencyInput,
  Dropdown,
  Icon,
} from '../../components';
import { colors, font, numbers } from '../../constants/globalStyle';
import { TransactionStackParams } from '../../navigation/TransactionNavigator';
import { TransactionContext } from '../../state/context';
import { usePockets, useTransactions } from '../../state/queries';
import { DropdownOption } from '../../types';
import { currencyFormatter } from '../../utils';

type Props = {
  navigation: NavigationProp<TransactionStackParams, 'addTransaction'>;
};

export function AddTransaction({ navigation }: Props) {
  // Form fields
  const [transactionTitle, setTransactionTitle] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('$0.00');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [date, setDate] = useState(new Date());
  const [inflow, setInflow] = useState<DropdownOption | undefined>(undefined);
  const externalOption = { label: 'External', value: 'external' };
  const [outflow, setOutflow] = useState<DropdownOption | undefined>(externalOption);
  const { transactionTags, setTransactionTags } = useContext(TransactionContext);
  const [note, setNote] = useState('');

  const { close } = useBottomSheet();
  const { bottom } = useSafeAreaInsets();
  const { fetchPockets } = usePockets();
  const { createTransaction } = useTransactions();
  const isValid =
    transactionTitle &&
    transactionAmount &&
    date &&
    inflow &&
    outflow &&
    inflow.value !== outflow.value;

  const flowOptions = [{ label: 'Pockets', value: '', isHeader: true }];
  flowOptions.push(
    ...(fetchPockets.data || []).map(pocket => ({
      label: `${pocket.name} (${currencyFormatter.format(pocket.amount)})`,
      value: pocket.id,
      isHeader: false,
    })),
  );

  function resetForm() {
    setTransactionTitle('');
    setTransactionAmount('$0.00');
    setDate(new Date());
    setInflow(undefined);
    setOutflow(externalOption);
    setTransactionTags([]);
    setNote('');
  }

  return (
    <View style={styles.flex}>
      <KeyboardAvoidingView
        behavior="padding"
        style={styles.flex}
        keyboardVerticalOffset={bottom + 18}
      >
        <View style={styles.container}>
          <Pressable
            onPress={() => {
              Keyboard.dismiss();
              close();
            }}
            style={styles.closeBtn}
          >
            <Icon name="x" style={styles.close} />
          </Pressable>
          <ScrollView contentContainerStyle={styles.scroll}>
            <TextInput
              value={transactionTitle}
              onChangeText={setTransactionTitle}
              placeholder="Title of Transaction"
              style={styles.title}
              autoCorrect={false}
              spellCheck={false}
            />
            <CurrencyInput
              value={transactionAmount}
              setValue={setTransactionAmount}
              style={styles.amount}
            />
            <View style={styles.details}>
              <Pressable
                onPress={() => setDatePickerVisibility(true)}
                style={[styles.input, styles.datePickerRow]}
              >
                <Text style={styles.text}>{date.toLocaleDateString()}</Text>
                <AnimatedChevron chevronUp={isDatePickerVisible} />
              </Pressable>

              <Dropdown
                label="Inflow"
                placeholder="Where's the money coming from?"
                options={flowOptions}
                value={inflow}
                setValue={setInflow}
                topOption={externalOption}
              />

              <Dropdown
                label="Outflow"
                placeholder="Where's the money going?"
                options={flowOptions}
                value={outflow}
                setValue={setOutflow}
                topOption={externalOption}
              />

              <AnimatedPressable
                style={styles.tagPressable}
                onPress={() => navigation.navigate('selectTags')}
              >
                <View style={styles.tagContainer}>
                  <Text style={styles.text}>Select Tags</Text>
                  {transactionTags.length > 0 && (
                    <Text style={styles.smallText}>
                      {transactionTags.length <= 3
                        ? transactionTags.join(', ')
                        : transactionTags.slice(0, 3).join(', ') +
                          (transactionTags.length > 3 && ` +${transactionTags.length - 3} more`)}
                    </Text>
                  )}
                </View>
                <Icon name="chevron-right" style={styles.chevron} />
              </AnimatedPressable>

              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder="Add a note"
                style={styles.input}
                autoCorrect={false}
                spellCheck={false}
              />
            </View>
            <View style={styles.flex} />
            <Button
              label="Add Transaction"
              onPress={() => {
                createTransaction.mutate(
                  {
                    name: transactionTitle,
                    amount: parseFloat(transactionAmount.replace(/[^0-9.-]+/g, '')),
                    date,
                    // it's okay to force unwrap here because we know that inflow and outflow are defined
                    inflow: inflow!.value,
                    outflow: outflow!.value,
                    tags: transactionTags,
                    note,
                  },
                  {
                    onSuccess: () => {
                      fetchPockets.refetch();
                      close();
                      resetForm();
                    },
                  },
                );
              }}
              disabled={!isValid}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      {/** Put date picker outside of KeyboardAvoidingView so the app doesn't freeze */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        date={date}
        mode="date"
        display="inline"
        onConfirm={newDate => {
          setDate(newDate);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        buttonTextColorIOS={colors.temp.black}
        accentColor={colors.temp.black}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 25,
    flex: 1,
    backgroundColor: colors.temp.gray,
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    left: 10,
  },
  close: {
    fontSize: 18,
    color: colors.temp.black,
  },
  chevron: {
    fontSize: 16,
    color: colors.temp.darkGray,
  },
  title: {
    fontSize: 22,
    fontFamily: font.bold,
    alignSelf: 'center',
  },
  amount: {
    fontSize: 50,
    fontFamily: font.bold,
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: colors.temp.midGray,
    borderRadius: numbers.borderRadius.small,
    padding: 10,
  },
  details: {
    flexDirection: 'column',
    gap: 15,
    paddingTop: 20,
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    fontSize: 14,
    fontFamily: font.regular,
  },
  tagPressable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.temp.white,
    borderRadius: numbers.borderRadius.small,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  tagContainer: {
    flexDirection: 'column',
  },
  datePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
    fontFamily: font.semiBold,
    color: colors.temp.black,
  },
  smallText: {
    fontSize: 12,
    fontFamily: font.regular,
    color: colors.temp.darkGray,
  },
  inputGroup: {
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 10,
    fontFamily: font.regular,
    color: colors.temp.darkGray,
  },
});
