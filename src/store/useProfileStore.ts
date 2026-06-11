import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile } from '../types';

interface ProfileState extends UserProfile {
  isProfileSet: boolean;
  setProfile: (profile: UserProfile) => void;
  updateName: (name: string) => void;
  updateEmail: (email: string) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: '',
      email: '',
      isProfileSet: false,
      setProfile: (profile) => set({ ...profile, isProfileSet: true }),
      updateName: (name) => set({ name }),
      updateEmail: (email) => set({ email }),
    }),
    {
      name: 'expenseiq-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
