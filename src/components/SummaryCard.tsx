import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';

interface SummaryCardProps {
  title: string;
  amount: number;
  type?: 'neutral' | 'income' | 'expense';
}

// Compact formatter: 150000 → "1.5L", 50000 → "50K", 999 → "999"
function compactAmount(value: number, currency: string): string {
  if (currency === 'INR') {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000)   return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000)     return `${(value / 1000).toFixed(0)}K`;
    return `${Math.round(value)}`;
  } else {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000)    return `${(value / 1000).toFixed(1)}K`;
    return `${Math.round(value)}`;
  }
}

export default function SummaryCard({ title, amount, type = 'neutral' }: SummaryCardProps) {
  const { theme, currency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const getAmountColor = () => {
    if (type === 'income') return currentTheme.success;
    if (type === 'expense') return currentTheme.danger;
    return currentTheme.text;
  };

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
      <Text style={[styles.title, { color: currentTheme.textSecondary }]}>{title}</Text>
      <Text style={[styles.amount, { color: getAmountColor() }]} numberOfLines={1} adjustsFontSizeToFit>
        {symbol}{compactAmount(amount, currency)}
      </Text>
      {/* Full value on second line for reference */}
      <Text style={[styles.full, { color: currentTheme.textSecondary }]} numberOfLines={1}>
        {symbol}{amount.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  full: {
    fontSize: 10,
    marginTop: 3,
    opacity: 0.7,
  },
});
