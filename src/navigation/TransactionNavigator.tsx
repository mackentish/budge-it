import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';

import { AddTransaction, SelectTags } from '../screens/sheets';
import { TransactionContext } from '../state/context';

export type TransactionStackParams = {
  addTransaction: undefined;
  selectTags: undefined;
};

export default function TransactionNavigator() {
  const { Navigator, Screen } = createStackNavigator();
  const [transactionTags, setTransactionTags] = useState<string[]>([]);

  return (
    <NavigationContainer>
      <TransactionContext.Provider value={{ transactionTags, setTransactionTags }}>
        <Navigator screenOptions={{ headerShown: false }}>
          <Screen name="addTransaction" component={AddTransaction} />
          <Screen name="selectTags" component={SelectTags} />
        </Navigator>
      </TransactionContext.Provider>
    </NavigationContainer>
  );
}
