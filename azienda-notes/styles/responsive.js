import { Dimensions } from 'react-native';

// Obtenir la largeur de l'écran
const { width } = Dimensions.get('window');

// Définir les breakpoints pour différents appareils
export const breakpoints = {
  // Mobile (petit écran)
  mobile: 320,
  // Tablette (petite)
  tabletSmall: 480,
  // Tablette (grande)
  tabletLarge: 768,
  // Desktop (petit)
  desktopSmall: 1024,
  // Desktop (grand)
  desktopLarge: 1440,
};

// Fonction pour vérifier la taille de l'écran
export const isMobile = width < breakpoints.tabletSmall;
export const isTablet = width >= breakpoints.tabletSmall && width < breakpoints.desktopSmall;
export const isDesktop = width >= breakpoints.desktopSmall;

// Styles responsifs pour les marges et le padding
export const spacing = {
  // Marges
  margin: {
    mobile: 10,
    tablet: 20,
    desktop: 30,
  },
  // Padding
  padding: {
    mobile: 10,
    tablet: 20,
    desktop: 30,
  },
};

// Styles responsifs pour les tailles de police
export const typography = {
  h1: {
    mobile: 24,
    tablet: 32,
    desktop: 40,
  },
  h2: {
    mobile: 20,
    tablet: 28,
    desktop: 36,
  },
  body: {
    mobile: 14,
    tablet: 16,
    desktop: 18,
  },
  small: {
    mobile: 12,
    tablet: 14,
    desktop: 16,
  },
};

// Fonction utilitaire pour obtenir la valeur responsive
export const getResponsiveValue = (values) => {
  if (isMobile) return values.mobile;
  if (isTablet) return values.tablet;
  return values.desktop;
};

// Exemple d'utilisation :
// const fontSize = getResponsiveValue(typography.h1);
// const margin = getResponsiveValue(spacing.margin); 