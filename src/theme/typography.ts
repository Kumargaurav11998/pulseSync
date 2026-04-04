/**
 * Typography constraints.
 * Ensure you link these fonts in the native iOS/Android code.
 * (e.g., Manrope and Inter from Google Fonts)
 */
export const typography = {
  fontFamilies: {
    headline: 'Manrope-Regular',  // Update based on actual font linking naming
    headlineBold: 'Manrope-Bold',
    body: 'Inter-Regular',
    bodyMedium: 'Inter-Medium',
    bodyBold: 'Inter-Bold',
  },
  
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
    black: '900',
  } as const,

  sizes: {
    giant: 48,
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    subtext: 14,
    caption: 12,
    tiny: 10,
  },

  lineHeights: {
    giant: 56,
    h1: 40,
    h2: 32,
    h3: 28,
    h4: 24,
    body: 24,
    subtext: 20,
    caption: 16,
    tiny: 14,
  }
};
