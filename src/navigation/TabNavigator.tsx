import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '../components';
import { colors, font } from '../constants/globalStyle';
import { Dashboard, Settings, Summary, Transactions } from '../screens';

function HomeIcon({ color }: { color: string }) {
  return <Icon name="home" style={[styles.icon, { color: color }]} />;
}
function TransactionIcon({ color }: { color: string }) {
  return <Icon name="plus" style={[styles.icon, { color: color }]} />;
}
function SummaryIcon({ color }: { color: string }) {
  return <Icon name="summary" style={[styles.icon, { color: color }]} />;
}
function UserIcon({ color }: { color: string }) {
  return <Icon name="user" style={[styles.icon, { color: color }]} />;
}

const { Navigator, Screen } = createBottomTabNavigator();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.temp.black,
        tabBarInactiveTintColor: colors.temp.gray,
        tabBarItemStyle: {
          paddingTop: 10,
        },
        tabBarStyle: {
          paddingBottom: insets.bottom,
          height: 60 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontFamily: font.regular,
          fontSize: 14,
          fontWeight: '600',
        },
      }}
    >
      <Screen
        options={{
          tabBarIcon: HomeIcon,
          tabBarLabel: 'Home',
        }}
        name="home"
        component={Dashboard}
      />
      <Screen
        options={{
          tabBarIcon: TransactionIcon,
          tabBarLabel: 'Transactions',
        }}
        name="transactions"
        component={Transactions}
      />
      <Screen
        options={{
          tabBarIcon: SummaryIcon,
          tabBarLabel: 'Summary',
        }}
        name="summary"
        component={Summary}
      />
      <Screen
        options={{
          tabBarIcon: UserIcon,
          tabBarLabel: 'Settings',
        }}
        name="settings"
        component={Settings}
      />
    </Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 30,
  },
});
