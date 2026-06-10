import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Transaction } from '../types';
import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';
import { format } from 'date-fns';

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  const { theme, currency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;
  
  const isIncome = transaction.type === 'Income';
  const amountColor = isIncome ? currentTheme.success : currentTheme.danger;
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  return (
    <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isIncome ? 'arrow-down-circle' : 'arrow-up-circle'} 
          size={36} 
          color={amountColor} 
        />
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: currentTheme.text }]} numberOfLines={1}>
          {transaction.title}
        </Text>
        <Text style={[styles.category, { color: currentTheme.textSecondary }]}>
          {transaction.category} • {format(new Date(transaction.date), 'dd MMM yyyy')}
        </Text>
      </View>
      
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: amountColor }]}>
          {isIncome ? '+' : '-'}{currencySymbol}{transaction.amount.toLocaleString()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 6,
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
