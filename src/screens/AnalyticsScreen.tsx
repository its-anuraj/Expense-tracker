import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AnalyticsScreen() {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;
  const { transactions } = useTransactionStore();

  const screenWidth = Dimensions.get('window').width;

  // Process data for Pie Chart (Expenses by Category)
  const expensesByCategory = transactions
    .filter(t => t.type === 'Expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map((category, index) => {
    // Generate a color based on index
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    return {
      name: category,
      amount: expensesByCategory[category],
      color: colors[index % colors.length],
      legendFontColor: currentTheme.textSecondary,
      legendFontSize: 12,
    };
  });

  // Calculate Monthly Income Trend for the last 6 months
  const processMonthlyIncome = () => {
    const months = [];
    const incomes = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
      
      const monthIncome = transactions
        .filter(t => t.type === 'Income')
        .filter(t => {
          const tDate = new Date(t.date);
          return tDate.getMonth() === d.getMonth() && tDate.getFullYear() === d.getFullYear();
        })
        .reduce((sum, curr) => sum + curr.amount, 0);
      
      incomes.push(monthIncome);
    }
    
    return { labels: months, data: incomes };
  };

  const monthlyTrend = processMonthlyIncome();

  const barData = {
    labels: monthlyTrend.labels,
    datasets: [
      {
        data: monthlyTrend.data.some(d => d > 0) ? monthlyTrend.data : [0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const chartConfig = {
    backgroundColor: currentTheme.card,
    backgroundGradientFrom: currentTheme.card,
    backgroundGradientTo: currentTheme.card,
    color: (opacity = 1) => currentTheme.primary,
    labelColor: (opacity = 1) => currentTheme.textSecondary,
    barPercentage: 0.6,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={[styles.title, { color: currentTheme.text }]}>Analytics & Reports</Text>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Expenses by Category</Text>
          {pieData.length > 0 ? (
            <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <PieChart
                data={pieData}
                width={screenWidth - 64}
                height={200}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          ) : (
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              Not enough data to display.
            </Text>
          )}
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Monthly Income Trend</Text>
          <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border, paddingVertical: 16 }]}>
            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={220}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
              showValuesOnTopOfBars
              withInnerLines={false}
            />
          </View>
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
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  chartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
});
