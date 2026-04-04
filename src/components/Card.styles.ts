import { StyleSheet } from 'react-native';
import { colors, spacing, commonStyles } from '../theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadiusLarge,
    padding: spacing.cardPadding,
    marginVertical: spacing.s,
  },
  elevated: {
    ...commonStyles.elevationLow,
  },
  flat: {
    backgroundColor: colors.surfaceVariant,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
