import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Colors } from '../constants/Colors';
import { useThemeStore } from '../store/useThemeStore';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function CustomInput({ label, error, style, ...props }: CustomInputProps) {
  const { theme } = useThemeStore();
  const currentTheme = Colors[theme === 'system' ? 'light' : theme] || Colors.light;

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: currentTheme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: currentTheme.card,
            color: currentTheme.text,
            borderColor: error ? currentTheme.danger : currentTheme.border 
          },
          style,
        ]}
        placeholderTextColor={currentTheme.textSecondary}
        {...props}
      />
      {error && <Text style={[styles.error, { color: currentTheme.danger }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
});
