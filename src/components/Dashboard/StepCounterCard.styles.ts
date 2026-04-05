import { StyleSheet } from 'react-native';
import { colors, spacing } from '../../theme';

export const styles = StyleSheet.create({
  card: {
    marginTop: spacing.s,
    padding: spacing.l,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  goalPill: {
    backgroundColor: colors.success + '18',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: spacing.borderRadiusPill,
  },
  goalText: {
    color: colors.success,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.m,
  },
  stepsValue: {
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 42,
    letterSpacing: -1,
  },
  stepsUnit: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  goalSubtext: {
    marginLeft: spacing.s,
    color: colors.textSecondary,
    fontSize: 12,
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: spacing.s,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  progressFillGoal: {
    backgroundColor: colors.success,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.surfaceVariant,
    marginVertical: 2,
  },
  statValue: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 15,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  noSensorText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.m,
    opacity: 0.7,
  },
});
