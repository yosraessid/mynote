// ResponsiveExample.js
// This component demonstrates how to use responsive styles in React Native.

import React from 'react'; // Import React
import { StyleSheet, Text, View } from 'react-native'; // Import React Native components
import { getResponsiveValue, spacing, typography } from '../styles/responsive'; // Import responsive helpers

const ResponsiveExample = () => { // Main functional component
  return (
    <View style={styles.container}> {/* Main container with responsive padding and margin */}
      <Text style={styles.title}>Responsive Title</Text> {/* Responsive title */}
      <Text style={styles.body}>
        This text automatically adapts to the screen size.
      </Text> {/* Responsive body text */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveValue(spacing.padding), // Responsive padding
    margin: getResponsiveValue(spacing.margin),   // Responsive margin
  },
  title: {
    fontSize: getResponsiveValue(typography.h1),  // Responsive title size
    fontWeight: 'bold',                           // Bold text
    marginBottom: getResponsiveValue(spacing.margin), // Responsive space below
  },
  body: {
    fontSize: getResponsiveValue(typography.body), // Responsive body text size
  },
});

export default ResponsiveExample; // Export the component 