import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';

import { AddTransaction } from '../screens/sheets/addTransaction';
import { SelectTags } from '../screens/sheets/selectTags';
import { TransactionContext } from '../state/context';

export type TransactionStackParams = {
  addTransaction: undefined;
  selectTags: undefined;
};

export default function TransactionNavigator() {
  const { Navigator, Screen } = createStackNavigator();
  const [transactionTags, setTransactionTags] = useState<string[]>([]);

  return (
    <NavigationContainer independent>
      <TransactionContext.Provider value={{ transactionTags, setTransactionTags }}>
        <Navigator screenOptions={{ headerShown: false }} initialRouteName="addTransaction">
          <Screen name="addTransaction" component={AddTransaction} />
          <Screen name="selectTags" component={SelectTags} />
        </Navigator>
      </TransactionContext.Provider>
    </NavigationContainer>
  );
}
