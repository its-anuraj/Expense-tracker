import React from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Colors } from '../constants/Colors';
import { ExpenseCategories, IncomeCategories } from '../constants/Categories';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.string().min(1, 'Amount is required').refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  type: z.enum(['Income', 'Expense']),
  category: z.string().min(1, 'Category is required'),
  notes: z.string().optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

export default function AddTransactionScreen() {
  const navigation = useNavigation();
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;
  const { addTransaction } = useTransactionStore();

  const { control, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'Expense',
      category: ExpenseCategories[0],
    },
  });

  const transactionType = watch('type');
  const activeCategories = transactionType === 'Income' ? IncomeCategories : ExpenseCategories;

  const onSubmit = (data: TransactionFormData) => {
    addTransaction({
      id: Date.now().toString(),
      title: data.title,
      amount: Number(data.amount),
      type: data.type,
      category: data.category,
      notes: data.notes,
      date: new Date().toISOString(),
      createdAt: Date.now(),
    });
    Alert.alert('Success', 'Transaction added successfully');
    reset();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          
          <Text style={[styles.title, { color: currentTheme.text }]}>New Transaction</Text>

          <View style={styles.typeSelector}>
            <CustomButton
              title="Expense"
              variant={transactionType === 'Expense' ? 'danger' : 'outline'}
              style={styles.typeButton}
              onPress={() => {
                setValue('type', 'Expense');
                setValue('category', ExpenseCategories[0]);
              }}
            />
            <CustomButton
              title="Income"
              variant={transactionType === 'Income' ? 'success' : 'outline'}
              style={styles.typeButton}
              onPress={() => {
                setValue('type', 'Income');
                setValue('category', IncomeCategories[0]);
              }}
            />
          </View>

          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Title"
                placeholder="e.g. Groceries"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.title?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Amount"
                placeholder="0.00"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.amount?.message}
              />
            )}
          />

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
                  {activeCategories.map((cat) => (
                    <Picker.Item key={cat} label={cat} value={cat} />
                  ))}
                </Picker>
              )}
            />
          </View>

          <Controller
            control={control}
            name="notes"
            render={({ field: { onChange, onBlur, value } }) => (
              <CustomInput
                label="Notes (Optional)"
                placeholder="Add some details..."
                multiline
                numberOfLines={3}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{ height: 80, textAlignVertical: 'top' }}
              />
            )}
          />

          <CustomButton 
            title="Save Transaction" 
            onPress={handleSubmit(onSubmit)} 
            style={{ marginTop: 24 }}
          />

        </ScrollView>
      </KeyboardAvoidingView>
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
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    flex: 0.48,
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
});
