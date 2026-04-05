import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.m,
    width: '100%',
  },
  label: {
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.surfaceVariant,
    borderRadius: spacing.borderRadius,
    height: 54, // Better touch target
    paddingHorizontal: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamilies.body,
    height: '100%',
  },
  iconContainer: {
    marginRight: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    marginLeft: spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.s,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
});
