import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.l,
  },
  title: {
    fontFamily: typography.fontFamilies.headlineBold,
    fontSize: typography.sizes.h1,
    color: colors.textPrimary,
    marginBottom: spacing.s,
  },
  subtitle: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.sizes.body,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  doctorCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadiusLarge,
    padding: spacing.l,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  avatarText: {
    fontSize: 24,
    color: colors.textInverse,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: typography.fontFamilies.bodyBold,
    fontSize: typography.sizes.body,
    color: colors.textPrimary,
  },
  specialty: {
    fontFamily: typography.fontFamilies.body,
    fontSize: typography.sizes.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: spacing.borderRadiusPill,
    alignSelf: 'flex-start',
    marginTop: spacing.s,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  successBadge: {
    backgroundColor: '#DEF7EC',
  },
  errorBadge: {
    backgroundColor: '#FDE8E8',
  },
  successText: {
    color: '#03543F',
  },
  errorText: {
    color: '#9B1C1C',
  },
  actionButton: {
    backgroundColor: colors.primary,
    padding: spacing.s,
    borderRadius: spacing.borderRadius,
  },
  actionButtonText: {
    color: colors.textInverse,
    fontSize: 12,
  },
  emergencyCard: {
    marginTop: spacing.xl,
    padding: spacing.l,
    backgroundColor: '#EFF6FF',
    borderRadius: spacing.borderRadiusLarge,
  },
  emergencyTitle: {
    color: '#1E40AF',
  },
  emergencyText: {
    color: '#1E40AF',
    marginTop: 4,
  },
  infoCard: {
    marginVertical: spacing.l,
    padding: spacing.l,
  },
  healthIdLabel: {
    marginBottom: spacing.m,
  },
  healthIdValue: {
    color: colors.primary,
  },
});
