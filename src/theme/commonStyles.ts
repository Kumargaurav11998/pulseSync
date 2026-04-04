import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

/**
 * Reusable layout and stylistic objects
 */
export const commonStyles = StyleSheet.create({
  // Layouts
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.screenPadding,
  },
  screenContainerNoPadding: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Visual effects
  elevationLow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  elevationMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
