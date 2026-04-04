import { StyleSheet, Dimensions } from 'react-native';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary, 
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 128,
    height: 128,
    borderRadius: spacing.xxl,
    backgroundColor: colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.white20,
  },
  logoText: {
    color: colors.textInverse,
    fontSize: typography.sizes.h2,
    fontWeight: typography.weights.bold,
  },
  title: {
    fontSize: typography.sizes.giant,
    fontWeight: typography.weights.extraBold,
    color: colors.textInverse,
    marginBottom: spacing.s,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: typography.sizes.subtext,
    fontWeight: typography.weights.semiBold,
    color: colors.white70,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: spacing.xxxl + spacing.xl, // approx 80
    alignItems: 'center',
  },
  loaderBar: {
    width: width * 0.5,
    height: spacing.xs,
    backgroundColor: colors.white10,
    borderRadius: spacing.xs / 2,
    overflow: 'hidden',
    marginBottom: spacing.m,
  },
  loaderFill: {
    width: '33%',
    height: '100%',
    backgroundColor: colors.primaryContainer,
    borderRadius: spacing.xs / 2,
  },
  loaderText: {
    color: colors.white40,
    fontSize: typography.sizes.tiny,
    fontWeight: typography.weights.bold,
    letterSpacing: 2,
  },
});
