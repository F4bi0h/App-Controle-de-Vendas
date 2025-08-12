import React from 'react';
import { Switch } from 'react-native-paper';
import { useThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  return (
    <Switch
      value={theme.dark}
      onValueChange={toggleTheme}
      style={{ alignSelf: 'flex-end', marginBottom: 10 }}
    />
  );
}
