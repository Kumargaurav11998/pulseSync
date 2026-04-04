import { StyleSheet } from 'react-native';
import { colors, spacing, commonStyles } from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    ...commonStyles.screenContainerNoPadding,
  },
  scrollContent: {
    padding: spacing.screenPadding,
    paddingBottom: spacing.giant,
  },
  greetingHeader: {
    marginTop: spacing.m,
  },
  dateText: {
    marginBottom: spacing.l,
    opacity: 0.7,
  },
  heartRateCard: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    minHeight: 180,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  cardTitle: {
    letterSpacing: 1.2,
    opacity: 0.6,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  vitalValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  vitalValue: {
    color: colors.textPrimary,
  },
  vitalUnit: {
    marginLeft: spacing.xs,
    color: colors.textSecondary,
  },
  graphPlaceholder: {
    marginTop: spacing.m,
    height: 60,
    backgroundColor: colors.primaryContainer + '10', // 10% opacity
    borderRadius: spacing.borderRadius,
    borderWidth: 1,
    borderColor: colors.primaryContainer + '20',
    borderStyle: 'dashed',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.s,
  },
  halfCard: {
    width: '48.5%',
    padding: spacing.m,
    minHeight: 120,
  },
  spO2Card: {
    backgroundColor: colors.surface,
  },
  weightCard: {
    backgroundColor: colors.surface,
  },
  statusText: {
    marginTop: spacing.s,
    opacity: 0.8,
  },
  stepsCard: {
    marginTop: spacing.s,
    padding: spacing.l,
  },
  stepsContainer: {
    marginTop: spacing.m,
  },
  stepsTextContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.s,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.surfaceVariant,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    width: '84%',
  },
  sleepCardSmall: {
    marginTop: spacing.s,
    backgroundColor: colors.surface,
  },
  chartContainer: {
    marginTop: spacing.m,
    alignItems: 'center',
    marginLeft: -20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.s,
    paddingTop: spacing.s,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant + '40',
  },
  syncStatus: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: 'bold',
  },
  updateTime: {
    opacity: 0.6,
    fontSize: 10,
  },
  weightCardFull: {
    marginTop: spacing.m,
    padding: spacing.m,
    backgroundColor: colors.surface,
  },
  weightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  weightIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.secondary + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.s,
  },
  weightIconText: {
    fontSize: 20,
    color: colors.secondary,
  },
  weightTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weightTrendPill: {
    backgroundColor: '#ffda7230',
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    borderRadius: 12,
  },
  weightTrendText: {
    color: '#8a5100',
    fontSize: 10,
    fontWeight: '600',
  },
  weightBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  weightChartContainer: {
    marginBottom: -10,
    marginRight: -10,
  },
  lastDaysText: {
    marginTop: 4,
    opacity: 0.5,
    fontSize: 10,
    letterSpacing: 1,
  },
});
