import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { Colors } from '../constants/Colors';

import DashboardScreen from '../screens/DashboardScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import AddTransactionScreen from '../screens/AddTransactionScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import BudgetPlannerScreen from '../screens/BudgetPlannerScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'History') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Add') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
            size = 32;
          } else if (route.name === 'Analytics') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Budget') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Tab bar background and text colors
        tabBarStyle: {
          backgroundColor: currentTheme.card,
          borderTopColor: currentTheme.border,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: currentTheme.primary,
        tabBarInactiveTintColor: currentTheme.textSecondary,
        // Header background and text colors
        headerStyle: {
          backgroundColor: currentTheme.card,
          borderBottomColor: currentTheme.border,
          borderBottomWidth: 1,
        },
        headerTintColor: currentTheme.text,
        headerTitleStyle: {
          fontWeight: 'bold',
          color: currentTheme.text,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
      <Tab.Screen name="History" component={TransactionHistoryScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Add" component={AddTransactionScreen} options={{ title: 'Add Transaction', headerShown: false }} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Budget" component={BudgetPlannerScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
