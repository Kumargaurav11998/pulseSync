import { StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: spacing.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    flexDirection: 'row',
  },
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  text: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.s,
  },
  disabled: {
    backgroundColor: colors.surfaceVariant,
    borderColor: colors.surfaceVariant,
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textInverse,
    textAlign: 'center',
  },
});
