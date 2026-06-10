import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  style?: ViewStyle;
  textStyle?: TextStyle;
  loading?: boolean;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  loading = false,
  disabled = false,
}: CustomButtonProps) {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;

  const getBackgroundColor = () => {
    if (disabled) return currentTheme.border;
    switch (variant) {
      case 'secondary': return currentTheme.secondary;
      case 'danger': return currentTheme.danger;
      case 'success': return currentTheme.success;
      case 'outline': return 'transparent';
      default: return currentTheme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return currentTheme.textSecondary;
    if (variant === 'outline') return currentTheme.primary;
    return '#FFFFFF';
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'outline' && { borderWidth: 1, borderColor: currentTheme.primary },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
