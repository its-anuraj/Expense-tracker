import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import TransactionCard from '../components/TransactionCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionHistoryScreen() {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;
  const { transactions } = useTransactionStore();
  
  const [filter, setFilter] = useState<'All' | 'Income' | 'Expense'>('All');

  const filteredTransactions = transactions.filter(t => filter === 'All' || t.type === filter);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Transactions</Text>
      <View style={styles.filterContainer}>
        {['All', 'Income', 'Expense'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterTab,
              { backgroundColor: filter === f ? currentTheme.primary : currentTheme.card },
              filter === f && { borderColor: currentTheme.primary }
            ]}
            onPress={() => setFilter(f as any)}
          >
            <Text 
              style={[
                styles.filterText, 
                { color: filter === f ? '#FFF' : currentTheme.textSecondary }
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
            No transactions found.
          </Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80, // Space for bottom tabs
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
