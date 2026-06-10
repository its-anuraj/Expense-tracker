import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme, setTheme, currency, setCurrency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleCurrency = () => {
    const nextCurrency = currency === 'INR' ? 'USD' : currency === 'USD' ? 'EUR' : 'INR';
    setCurrency(nextCurrency);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#FFF" />
        </View>
        <Text style={[styles.name, { color: currentTheme.text }]}>John Doe</Text>
        <Text style={[styles.email, { color: currentTheme.textSecondary }]}>john.doe@example.com</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.textSecondary }]}>Preferences</Text>
        
        <View style={[styles.settingRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          <View style={styles.settingIconTitle}>
            <Ionicons name="moon" size={24} color={currentTheme.primary} style={styles.icon} />
            <Text style={[styles.settingText, { color: currentTheme.text }]}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
          />
        </View>

        <TouchableOpacity 
          style={[styles.settingRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}
          onPress={toggleCurrency}
          activeOpacity={0.7}
        >
          <View style={styles.settingIconTitle}>
            <Ionicons name="cash" size={24} color={currentTheme.primary} style={styles.icon} />
            <Text style={[styles.settingText, { color: currentTheme.text }]}>Currency</Text>
          </View>
          <Text style={[styles.settingValue, { color: currentTheme.textSecondary }]}>{currency}</Text>
        </TouchableOpacity>

      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: currentTheme.textSecondary }]}>More</Text>
        
        <TouchableOpacity style={[styles.settingRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]} activeOpacity={0.7}>
          <View style={styles.settingIconTitle}>
            <Ionicons name="help-circle" size={24} color={currentTheme.primary} style={styles.icon} />
            <Text style={[styles.settingText, { color: currentTheme.text }]}>Help & Support</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={currentTheme.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.settingRow, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]} activeOpacity={0.7}>
          <View style={styles.settingIconTitle}>
            <Ionicons name="log-out" size={24} color={currentTheme.danger} style={styles.icon} />
            <Text style={[styles.settingText, { color: currentTheme.danger }]}>Logout</Text>
          </View>
        </TouchableOpacity>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    padding: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingIconTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
