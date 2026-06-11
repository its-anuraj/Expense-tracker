import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserSettings } from '../types';

interface ThemeState extends UserSettings {
  setTheme: (theme: UserSettings['theme']) => void;
  setCurrency: (currency: UserSettings['currency']) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'dark', // Default is dark mode
      currency: 'INR',
      setTheme: (theme) => set({ theme }),
      setCurrency: (currency) => set({ currency }),
      resetTheme: () => set({ theme: 'dark', currency: 'INR' }),
    }),
    {
      name: 'expenseiq-theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
