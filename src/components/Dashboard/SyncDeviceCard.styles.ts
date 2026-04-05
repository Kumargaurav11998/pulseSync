import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    alignItems: 'center',
    borderRadius: spacing.borderRadiusLarge,
    marginTop: spacing.xl,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  iconText: {
    fontSize: 28,
    color: colors.primary,
  },
  title: {
    marginBottom: spacing.s,
    color: colors.textPrimary,
  },
  description: {
    textAlign: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.m,
    lineHeight: 20,
    opacity: 0.6,
  },
  button: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontFamily: typography.fontFamilies.bodyBold,
  },
});
