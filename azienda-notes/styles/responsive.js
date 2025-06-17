import { Dimensions } from 'react-native';

// Get the screen width
const { width } = Dimensions.get('window');

// Define breakpoints for different devices
export const breakpoints = {
  mobile: 320,         // Small mobile
  tabletSmall: 480,    // Small tablet
  tabletLarge: 768,    // Large tablet
  desktopSmall: 1024,  // Small desktop
  desktopLarge: 1440,  // Large desktop
  extraLarge: 1920,    // Extra large screens
};

// Check the screen size
export const isMobile = width < breakpoints.tabletSmall;
export const isTablet = width >= breakpoints.tabletSmall && width < breakpoints.desktopSmall;
export const isDesktop = width >= breakpoints.desktopSmall && width < breakpoints.extraLarge;
export const isExtraLarge = width >= breakpoints.extraLarge;

// Responsive spacing for margin and padding
export const spacing = {
  margin: {
    mobile: 12,
    tablet: 28,
    desktop: 40,
    extraLarge: 60,
  },
  padding: {
    mobile: 12,
    tablet: 28,
    desktop: 40,
    extraLarge: 60,
  },
};

// Responsive font sizes
export const typography = {
  h1: {
    mobile: 26,
    tablet: 36,
    desktop: 48,
    extraLarge: 56,
  },
  h2: {
    mobile: 22,
    tablet: 30,
    desktop: 40,
    extraLarge: 48,
  },
  body: {
    mobile: 16,
    tablet: 18,
    desktop: 22,
    extraLarge: 26,
  },
  small: {
    mobile: 13,
    tablet: 15,
    desktop: 18,
    extraLarge: 20,
  },
};

// Utility function to get the responsive value
export const getResponsiveValue = (values) => {
  if (isMobile) return values.mobile;
  if (isTablet) return values.tablet;
  if (isDesktop) return values.desktop;
  if (isExtraLarge) return values.extraLarge;
  return values.desktop;
};

// Example usage:
// const fontSize = getResponsiveValue(typography.h1);
// const margin = getResponsiveValue(spacing.margin); 