import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../store/useThemeStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { useBudgetStore } from '../store/useBudgetStore';
import { useProfileStore } from '../store/useProfileStore';
import { Colors } from '../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { theme, setTheme, currency, setCurrency } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'dark' : theme] || Colors.dark;
  const isDark = theme === 'dark' || theme === 'system';

  const { name, email, isProfileSet, setProfile } = useProfileStore();
  const { resetTransactions } = useTransactionStore();
  const { resetBudgets } = useBudgetStore();

  // Modal state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editEmail, setEditEmail] = useState(email);

  // First-time setup modal
  const [setupModalVisible, setSetupModalVisible] = useState(!isProfileSet);
  const [setupName, setSetupName] = useState('');
  const [setupEmail, setSetupEmail] = useState('');

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const toggleCurrency = () => {
    const nextCurrency = currency === 'INR' ? 'USD' : currency === 'USD' ? 'EUR' : 'INR';
    setCurrency(nextCurrency);
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset All Data',
      'Are you sure you want to delete all transactions and budgets? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: () => {
            resetTransactions();
            resetBudgets();
            Alert.alert('Success', 'All your data has been reset.');
          },
        },
      ]
    );
  };

  const handleSaveSetup = () => {
    if (!setupName.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }
    setProfile({ name: setupName.trim(), email: setupEmail.trim() });
    setSetupModalVisible(false);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Name Required', 'Please enter your name.');
      return;
    }
    setProfile({ name: editName.trim(), email: editEmail.trim() });
    setEditModalVisible(false);
  };

  const openEditModal = () => {
    setEditName(name);
    setEditEmail(email);
    setEditModalVisible(true);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const currencySymbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.background }]}>
      {/* ── First-time Setup Modal ── */}
      <Modal visible={setupModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalCard, { backgroundColor: currentTheme.card }]}>
            <View style={styles.modalAvatarWrap}>
              <View style={[styles.avatarLg, { backgroundColor: currentTheme.primary }]}>
                <Ionicons name="person-add" size={36} color="#FFF" />
              </View>
            </View>
            <Text style={[styles.modalTitle, { color: currentTheme.text }]}>
              Create Your Account
            </Text>
            <Text style={[styles.modalSubtitle, { color: currentTheme.textSecondary }]}>
              Enter your details to personalise the app
            </Text>

            <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.background, color: currentTheme.text, borderColor: currentTheme.border }]}
              placeholder="e.g. Anuraj Indolia"
              placeholderTextColor={currentTheme.textSecondary}
              value={setupName}
              onChangeText={setSetupName}
              autoCapitalize="words"
              returnKeyType="next"
            />

            <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Email (optional)</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.background, color: currentTheme.text, borderColor: currentTheme.border }]}
              placeholder="e.g. anuraj@email.com"
              placeholderTextColor={currentTheme.textSecondary}
              value={setupEmail}
              onChangeText={setSetupEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { backgroundColor: currentTheme.primary }]}
              onPress={handleSaveSetup}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Get Started 🚀</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Edit Profile Modal ── */}
      <Modal visible={editModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.modalCard, { backgroundColor: currentTheme.card }]}>
            <Text style={[styles.modalTitle, { color: currentTheme.text }]}>Edit Profile</Text>

            <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Full Name *</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.background, color: currentTheme.text, borderColor: currentTheme.border }]}
              placeholder="Your name"
              placeholderTextColor={currentTheme.textSecondary}
              value={editName}
              onChangeText={setEditName}
              autoCapitalize="words"
            />

            <Text style={[styles.inputLabel, { color: currentTheme.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: currentTheme.background, color: currentTheme.text, borderColor: currentTheme.border }]}
              placeholder="Your email"
              placeholderTextColor={currentTheme.textSecondary}
              value={editEmail}
              onChangeText={setEditEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.outlineBtn, { borderColor: currentTheme.border }]}
                onPress={() => setEditModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.outlineBtnText, { color: currentTheme.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveEdit}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Main Content ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          <View style={[styles.avatarLg, { backgroundColor: currentTheme.primary }]}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
          <Text style={[styles.profileName, { color: currentTheme.text }]}>
            {name || 'No Name Set'}
          </Text>
          {email ? (
            <Text style={[styles.profileEmail, { color: currentTheme.textSecondary }]}>{email}</Text>
          ) : null}
          <TouchableOpacity
            style={[styles.editProfileBtn, { borderColor: currentTheme.primary }]}
            onPress={openEditModal}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={16} color={currentTheme.primary} />
            <Text style={[styles.editProfileText, { color: currentTheme.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <Text style={[styles.sectionTitle, { color: currentTheme.textSecondary }]}>Preferences</Text>

        <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: isDark ? '#1E3A5F' : '#DBEAFE' }]}>
                <Ionicons name="moon" size={20} color={currentTheme.primary} />
              </View>
              <Text style={[styles.settingText, { color: currentTheme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: currentTheme.border, true: currentTheme.primary }}
              thumbColor={isDark ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: currentTheme.border }]} />

          {/* Currency */}
          <TouchableOpacity style={styles.settingRow} onPress={toggleCurrency} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: isDark ? '#1A3A2A' : '#DCFCE7' }]}>
                <Ionicons name="cash" size={20} color={currentTheme.success} />
              </View>
              <View>
                <Text style={[styles.settingText, { color: currentTheme.text }]}>Currency</Text>
                <Text style={[styles.settingSubtext, { color: currentTheme.textSecondary }]}>Tap to change</Text>
              </View>
            </View>
            <View style={[styles.badge, { backgroundColor: currentTheme.primary }]}>
              <Text style={styles.badgeText}>{currencySymbols[currency]} {currency}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* More */}
        <Text style={[styles.sectionTitle, { color: currentTheme.textSecondary }]}>More</Text>

        <View style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: isDark ? '#1A2B4A' : '#EDE9FE' }]}>
                <Ionicons name="help-circle" size={20} color={currentTheme.secondary} />
              </View>
              <Text style={[styles.settingText, { color: currentTheme.text }]}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: currentTheme.border }]} />

          <TouchableOpacity style={styles.settingRow} onPress={handleResetData} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBg, { backgroundColor: isDark ? '#3A1A1A' : '#FEE2E2' }]}>
                <Ionicons name="trash-bin" size={20} color={currentTheme.danger} />
              </View>
              <Text style={[styles.settingText, { color: currentTheme.danger }]}>Reset All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={currentTheme.danger} />
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={[styles.versionText, { color: currentTheme.textSecondary }]}>
          ExpenseIQ v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Profile Header
  profileHeader: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatarLg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 16,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // Section
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtext: {
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: 8,
  },
  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
  },
  modalAvatarWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  primaryBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  outlineBtn: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalBtns: {
    flexDirection: 'row',
    marginTop: 8,
  },
});
