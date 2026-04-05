import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppSelector } from '../../redux/hooks';
import { colors, spacing, typography } from '../../theme';

export const SleepCard: React.FC = () => {
  const sleepData = useAppSelector(state => state.health.sleep);

  // Fallback behavior if sleep hasn't sync'd yet
  const displayDuration = sleepData.duration || '0h 0m';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Sleep</Text>
        <Text style={styles.statusBadge}>{sleepData.status}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.valueText}>{displayDuration}</Text>
        <Text style={styles.unitText}>total duration</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: spacing.l,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    fontSize: typography.sizes.h3,
    fontWeight: typography.weights.semiBold,
    color: colors.textPrimary,
  },
  statusBadge: {
    fontSize: typography.sizes.tiny,
    color: colors.primary,
    backgroundColor: `${colors.primary}1A`,
    paddingHorizontal: spacing.s,
    paddingVertical: 4,
    borderRadius: 8,
    overflow: 'hidden',
    fontWeight: typography.weights.medium,
  },
  content: {
    alignItems: 'flex-start',
  },
  valueText: {
    fontSize: 28,
    fontWeight: typography.weights.bold,
    color: colors.secondary,
    marginBottom: 4,
  },
  unitText: {
    fontSize: typography.sizes.subtext,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
});
