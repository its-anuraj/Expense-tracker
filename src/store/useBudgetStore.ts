import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Budget } from '../types';

interface BudgetState {
  budgets: Budget[];
  setBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
  updateSpentAmount: (categoryId: string, amount: number) => void;
  resetBudgets: () => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      budgets: [],
      setBudget: (budget) =>
        set((state) => {
          const exists = state.budgets.find((b) => b.category === budget.category);
          if (exists) {
            return {
              budgets: state.budgets.map((b) =>
                b.category === budget.category ? budget : b
              ),
            };
          }
          return { budgets: [...state.budgets, budget] };
        }),
      deleteBudget: (id) =>
        set((state) => ({
          budgets: state.budgets.filter((b) => b.id !== id),
        })),
      updateSpentAmount: (category, amount) =>
        set((state) => ({
          budgets: state.budgets.map((b) =>
            b.category === category
              ? { ...b, spentAmount: b.spentAmount + amount }
              : b
          ),
        })),
      resetBudgets: () => set({ budgets: [] }),
    }),
    {
      name: 'expenseiq-budgets-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
