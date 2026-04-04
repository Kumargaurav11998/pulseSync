import { StyleSheet } from 'react-native';
import { colors, typography } from '../theme';

export const styles = StyleSheet.create({
  text: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamilies.body,
  },
  bold: {
    fontWeight: 'bold',
  },
  h1: {
    fontSize: typography.sizes.h1,
    lineHeight: typography.lineHeights.h1,
    fontFamily: typography.fontFamilies.headlineBold,
  },
  h2: {
    fontSize: typography.sizes.h2,
    lineHeight: typography.lineHeights.h2,
    fontFamily: typography.fontFamilies.headlineBold,
  },
  h3: {
    fontSize: typography.sizes.h3,
    lineHeight: typography.lineHeights.h3,
    fontFamily: typography.fontFamilies.headlineBold,
  },
  h4: {
    fontSize: typography.sizes.h4,
    lineHeight: typography.lineHeights.h4,
    fontFamily: typography.fontFamilies.headlineBold,
  },
  body: {
    fontSize: typography.sizes.body,
    lineHeight: typography.lineHeights.body,
  },
  subtext: {
    fontSize: typography.sizes.subtext,
    lineHeight: typography.lineHeights.subtext,
    color: colors.textSecondary,
  },
  caption: {
    fontSize: typography.sizes.caption,
    lineHeight: typography.lineHeights.caption,
    color: colors.textSecondary,
  },
  tiny: {
    fontSize: typography.sizes.tiny,
    lineHeight: typography.lineHeights.tiny,
    color: colors.textSecondary,
  },
  headline: {
    fontSize: typography.sizes.body,
    fontFamily: typography.fontFamilies.headline,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
