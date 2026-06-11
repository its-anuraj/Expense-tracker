import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './src/navigation/RootNavigator';
import { useThemeStore } from './src/store/useThemeStore';

function AppContent() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark' || theme === 'system';
  return (
    <SafeAreaProvider>
      <RootNavigator />
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#0F172A' : '#F1F5F9'} />
    </SafeAreaProvider>
  );
}

export default function App() {
  return <AppContent />;
}
