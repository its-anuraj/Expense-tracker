import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useThemeStore } from '../store/useThemeStore';
import { useBudgetStore } from '../store/useBudgetStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import { ExpenseCategories } from '../constants/Categories';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';

const budgetSchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  limit: z.string().min(1, 'Amount is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Limit must be a positive number',
  }),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

export default function BudgetPlannerScreen() {
  const { theme, currency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;
  const currencySymbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : '€';

  const { budgets, setBudget, deleteBudget } = useBudgetStore();
  const { transactions } = useTransactionStore();

  const [isAdding, setIsAdding] = useState(false);

  const { control, handleSubmit, reset, formState: { errors }, setValue } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: ExpenseCategories[0],
      limit: '',
    },
  });

  const onSubmit = (data: BudgetFormData) => {
    // Check if category already has a budget
    if (budgets.find(b => b.category.toLowerCase() === data.category.toLowerCase())) {
      Alert.alert('Error', 'Budget for this category already exists');
      return;
    }

    setBudget({
      id: Date.now().toString(),
      category: data.category,
      limit: Number(data.limit),
      spent: 0,
    });
    setIsAdding(false);
    reset();
  };

  const getSpentAmount = (category: string) => {
    return transactions
      .filter(t => t.type === 'Expense' && t.category.toLowerCase() === category.toLowerCase())
      .reduce((acc, curr) => acc + curr.amount, 0);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.text }]}>Budget Planner</Text>
          {!isAdding && (
            <CustomButton 
              title="+ Add Budget" 
              onPress={() => setIsAdding(true)} 
              variant="outline"
              style={styles.addButton}
            />
          )}
        </View>

        {isAdding && (
          <View style={[styles.addForm, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
            <Text style={[styles.formTitle, { color: currentTheme.text }]}>Create New Budget</Text>
            
            <Text style={[styles.label, { color: currentTheme.text }]}>Category</Text>
            <View style={[styles.pickerContainer, { borderColor: currentTheme.border, backgroundColor: currentTheme.card }]}>
              <Controller
                control={control}
                name="category"
                render={({ field: { onChange, value } }) => (
                  <Picker
                    selectedValue={value}
                    onValueChange={onChange}
                    style={{ color: currentTheme.text }}
                    dropdownIconColor={currentTheme.text}
                  >
                    {ExpenseCategories.map((cat) => (
                      <Picker.Item key={cat} label={cat} value={cat} />
                    ))}
                  </Picker>
                )}
              />
            </View>

            <Controller
              control={control}
              name="limit"
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomInput
                  label="Monthly Limit"
                  keyboardType="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.limit?.message}
                />
              )}
            />

            <View style={styles.formActions}>
              <CustomButton 
                title="Cancel" 
                onPress={() => { setIsAdding(false); reset(); }} 
                variant="outline" 
                style={styles.actionBtn}
              />
              <CustomButton 
                title="Save" 
                onPress={handleSubmit(onSubmit)} 
                style={styles.actionBtn}
              />
            </View>
          </View>
        )}

        <View style={styles.budgetsList}>
          {budgets.length === 0 && !isAdding ? (
            <Text style={[styles.emptyText, { color: currentTheme.textSecondary }]}>
              No budgets set yet. Track your spending limits!
            </Text>
          ) : (
            budgets.map((budget) => {
              const spent = getSpentAmount(budget.category);
              const progress = Math.min((spent / budget.limit) * 100, 100);
              const isOverBudget = spent >= budget.limit;

              return (
                <View key={budget.id} style={[styles.budgetCard, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                  <View style={styles.budgetHeader}>
                    <Text style={[styles.budgetCategory, { color: currentTheme.text }]}>{budget.category}</Text>
                    <TouchableOpacity onPress={() => deleteBudget(budget.id)}>
                      <Text style={{ color: currentTheme.danger }}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.budgetStats}>
                    <Text style={[styles.budgetAmount, { color: isOverBudget ? currentTheme.danger : currentTheme.textSecondary }]}>
                      {currencySymbol}{spent.toLocaleString()} <Text style={{ fontSize: 12 }}>spent</Text>
                    </Text>
                    <Text style={[styles.budgetLimit, { color: currentTheme.text }]}>
                      {currencySymbol}{budget.limit.toLocaleString()}
                    </Text>
                  </View>

                  <View style={[styles.progressBarBg, { backgroundColor: currentTheme.border }]}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { 
                          width: `${progress}%`,
                          backgroundColor: isOverBudget ? currentTheme.danger : currentTheme.primary
                        }
                      ]} 
                    />
                  </View>
                  {isOverBudget && (
                    <Text style={[styles.warningText, { color: currentTheme.danger }]}>You've exceeded your budget!</Text>
                  )}
                </View>
              );
            })
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
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 0,
  },
  addForm: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    marginTop: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionBtn: {
    flex: 0.48,
  },
  budgetsList: {
    marginTop: 8,
  },
  budgetCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetCategory: {
    fontSize: 18,
    fontWeight: '600',
  },
  budgetStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  budgetAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  budgetLimit: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningText: {
    fontSize: 12,
    marginTop: 8,
    fontWeight: '500',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
});
