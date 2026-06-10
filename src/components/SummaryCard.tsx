import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: 'neutral' | 'income' | 'expense';
}

export default function SummaryCard({ title, amount, type = 'neutral' }: SummaryCardProps) {
  const { theme, currency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;
  
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';
  
  const getAmountColor = () => {
    if (type === 'income') return currentTheme.success;
    if (type === 'expense') return currentTheme.danger;
    return currentTheme.text;
  };

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
      <Text style={[styles.title, { color: currentTheme.textSecondary }]}>{title}</Text>
      <Text style={[styles.amount, { color: getAmountColor() }]} numberOfLines={1}>
        {currencySymbol}{amount.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
