import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import SummaryCard from '../components/SummaryCard';
import TransactionCard from '../components/TransactionCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;
  const { transactions } = useTransactionStore();

  const totalIncome = transactions
    .filter((t) => t.type === 'Income')
    .reduce((acc, curr) => acc + curr.amount, 0);
  
  const totalExpense = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, curr) => acc + curr.amount, 0);
    
  const balance = totalIncome - totalExpense;
  const savings = balance > 0 ? balance : 0;

  const recentTransactions = transactions.slice(0, 5);

  const screenWidth = Dimensions.get('window').width;
  
  // Calculate Expenses for the last 7 days
  const processWeeklyExpenses = () => {
    const days = [];
    const expenses = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      days.push(d.toLocaleString('default', { weekday: 'short' }));
      
      const dayExpense = transactions
        .filter(t => t.type === 'Expense')
        .filter(t => {
          const tDate = new Date(t.date);
          return tDate.getDate() === d.getDate() && tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
        })
        .reduce((sum, curr) => sum + curr.amount, 0);
      
      expenses.push(dayExpense);
    }
    
    return { labels: days, data: expenses };
  };

  const weeklyData = processWeeklyExpenses();

  const data = {
    labels: weeklyData.labels,
    datasets: [
      {
        data: weeklyData.data.some(d => d > 0) ? weeklyData.data : [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(239, 68, 68, ${opacity})`, // Danger color
        strokeWidth: 2
      }
    ],
    legend: ['Weekly Expenses']
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: currentTheme.textSecondary }]}>Hello!</Text>
          <Text style={[styles.balanceTitle, { color: currentTheme.text }]}>Total Balance</Text>
          <Text style={[styles.balanceAmount, { color: currentTheme.primary }]}>
            ₹{balance.toLocaleString()}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard title="Income" amount={totalIncome} type="income" />
          <SummaryCard title="Expense" amount={totalExpense} type="expense" />
          <SummaryCard title="Savings" amount={savings} type="neutral" />
        </View>

        <View style={styles.chartContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Expense Overview</Text>
          <LineChart
            data={data}
            width={screenWidth - 32}
            height={220}
            chartConfig={{
              backgroundColor: currentTheme.card,
              backgroundGradientFrom: currentTheme.card,
              backgroundGradientTo: currentTheme.card,
              decimalPlaces: 0,
              color: (opacity = 1) => currentTheme.textSecondary,
              labelColor: (opacity = 1) => currentTheme.textSecondary,
              style: { borderRadius: 16 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: currentTheme.danger }
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.transactionsContainer}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Recent Transactions</Text>
          {recentTransactions.length === 0 ? (
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              No transactions yet. Start tracking!
            </Text>
          ) : (
            recentTransactions.map((t) => (
              <TransactionCard key={t.id} transaction={t} />
            ))
          )}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  transactionsContainer: {
    marginBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
  },
});
