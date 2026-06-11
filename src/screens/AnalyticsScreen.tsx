import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// Smart formatter: 10000 → "10K", 100000 → "1L" (for INR), 1500000 → "15L"
function formatAmount(value: number, currency: string): string {
  if (currency === 'INR') {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return `${Math.round(value)}`;
  } else {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return `${Math.round(value)}`;
  }
}

const CURRENCY_SYMBOL: Record<string, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
};

export default function AnalyticsScreen() {
  const { theme, currency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;
  const { transactions } = useTransactionStore();
  const symbol = CURRENCY_SYMBOL[currency] || '₹';

  const screenWidth = Dimensions.get('window').width;

  // ── Pie Chart: Expenses by Category ──────────────────────────────────────
  const expensesByCategory = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const PIE_COLORS = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  const pieData = Object.keys(expensesByCategory).map((category, index) => ({
    name: category,
    amount: expensesByCategory[category],
    color: PIE_COLORS[index % PIE_COLORS.length],
    legendFontColor: currentTheme.textSecondary,
    legendFontSize: 12,
  }));

  // Total expense for the period
  const totalExpense = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);

  // ── Bar Chart: Monthly Income Trend (last 6 months) ──────────────────────
  const processMonthlyIncome = () => {
    const months: string[] = [];
    const incomes: number[] = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));

      const monthIncome = transactions
        .filter((t) => t.type === 'Income')
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            tDate.getMonth() === d.getMonth() &&
            tDate.getFullYear() === d.getFullYear()
          );
        })
        .reduce((sum, curr) => sum + curr.amount, 0);

      incomes.push(monthIncome);
    }

    return { labels: months, data: incomes };
  };

  const monthlyTrend = processMonthlyIncome();
  const hasIncome = monthlyTrend.data.some((d) => d > 0);
  const chartData = hasIncome ? monthlyTrend.data : [0, 0, 0, 0, 0, 0];

  // Max value for Y-axis scaling
  const maxVal = Math.max(...chartData, 1);

  const barData = {
    labels: monthlyTrend.labels,
    datasets: [{ data: chartData }],
  };

  const chartConfig = {
    backgroundColor: currentTheme.card,
    backgroundGradientFrom: currentTheme.card,
    backgroundGradientTo: currentTheme.card,
    decimalPlaces: 0,                                          // ← No decimals
    color: (opacity = 1) => currentTheme.primary,
    labelColor: (opacity = 1) => currentTheme.textSecondary,
    barPercentage: 0.65,
    fillShadowGradientOpacity: 1,
    // Format Y-axis ticks as smart amounts
    formatYLabel: (val: string) => formatAmount(Number(val), currency),
  };

  // Stats cards for income trend
  const totalIncome6m = monthlyTrend.data.reduce((a, b) => a + b, 0);
  const avgMonthly = totalIncome6m / 6;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Text style={[styles.title, { color: currentTheme.text }]}>Analytics & Reports</Text>

        {/* ── Expense Breakdown ── */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Expenses by Category</Text>

          {pieData.length > 0 ? (
            <>
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

              {/* Legend with amounts */}
              <View style={[styles.legendContainer, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                {pieData.map((item) => (
                  <View key={item.name} style={styles.legendRow}>
                    <View style={styles.legendLeft}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={[styles.legendLabel, { color: currentTheme.text }]}>{item.name}</Text>
                    </View>
                    <View style={styles.legendRight}>
                      <Text style={[styles.legendAmount, { color: currentTheme.text }]}>
                        {symbol}{item.amount.toLocaleString()}
                      </Text>
                      <Text style={[styles.legendPct, { color: currentTheme.textSecondary }]}>
                        {totalExpense > 0 ? `${((item.amount / totalExpense) * 100).toFixed(0)}%` : '0%'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <View style={[styles.emptyCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
                Add some expenses to see the breakdown.
              </Text>
            </View>
          )}
        </View>

        {/* ── Monthly Income Trend ── */}
        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text }]}>Monthly Income Trend</Text>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>6-Month Total</Text>
              <Text style={[styles.statValue, { color: currentTheme.success }]}>
                {symbol}{totalIncome6m.toLocaleString()}
              </Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
              <Text style={[styles.statLabel, { color: currentTheme.textSecondary }]}>Monthly Avg</Text>
              <Text style={[styles.statValue, { color: currentTheme.primary }]}>
                {symbol}{Math.round(avgMonthly).toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border, paddingVertical: 16 }]}>
            <BarChart
              data={barData}
              width={screenWidth - 64}
              height={230}
              yAxisLabel={symbol}          // ← Dynamic currency symbol
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              fromZero
              showValuesOnTopOfBars={false} // ← Turned OFF (was showing ugly 1.00, 0.75)
              withInnerLines={true}
              withHorizontalLabels={true}
              segments={4}                 // ← Clean 4 Y-axis gridlines
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  chartSection: { marginBottom: 28 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    overflow: 'hidden',
  },
  // Legend
  legendContainer: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(148,163,184,0.2)',
  },
  legendLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendLabel: { fontSize: 14, fontWeight: '500' },
  legendRight: { alignItems: 'flex-end' },
  legendAmount: { fontSize: 14, fontWeight: '700' },
  legendPct: { fontSize: 12, marginTop: 2 },
  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  statLabel: { fontSize: 12, fontWeight: '500', marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: 'bold' },
  // Empty
  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, textAlign: 'center' },
});
