import { StyleSheet } from 'react-native';
import { colors, spacing, } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.l,
    paddingBottom: spacing.xl,
    justifyContent: 'center',
  },
  headerSection: {
    marginTop: spacing.m,
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: spacing.borderRadiusLarge,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: spacing.l,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: spacing.l,
    padding: spacing.s,
  },
  forgotPasswordText: {
    color: colors.primary,
  },
  loginButton: {
    marginBottom: spacing.m,
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.l,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  dividerText: {
    paddingHorizontal: spacing.m,
    color: colors.textSecondary,
  },
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  socialButton: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: spacing.borderRadius,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: spacing.s,
  },
  footerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.m,
  },
  signUpLink: {
    marginLeft: spacing.s,
    padding: spacing.s,
  },
  signUpText: {
    color: colors.primary,
  },
});
