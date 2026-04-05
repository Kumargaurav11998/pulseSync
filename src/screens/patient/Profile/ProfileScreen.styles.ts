import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.l,
    paddingBottom: spacing.xxxl,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    marginTop: spacing.xl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    elevation: 4,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  avatarLargeText: {
    fontSize: 40,
    fontFamily: typography.fontFamilies.headlineBold,
    color: colors.textInverse,
  },
  userName: {
    marginBottom: 4,
  },
  userEmail: {
    opacity: 0.7,
  },
  infoCard: {
    padding: spacing.l,
    marginBottom: spacing.xl,
    backgroundColor: colors.surface,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.m,
    color: colors.textPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoutButton: {
    marginTop: spacing.xl,
    paddingVertical: spacing.m,
    alignItems: 'center',
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: '#F87171',
  },
  logoutText: {
    color: '#EF4444',
    fontFamily: typography.fontFamilies.bodyBold,
  },
});
