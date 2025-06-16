import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getResponsiveValue, spacing, typography } from '../styles/responsive';

const ResponsiveExample = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Titre Responsive</Text>
      <Text style={styles.body}>
        Ce texte s'adapte automatiquement à la taille de l'écran
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: getResponsiveValue(spacing.padding),
    margin: getResponsiveValue(spacing.margin),
  },
  title: {
    fontSize: getResponsiveValue(typography.h1),
    fontWeight: 'bold',
    marginBottom: getResponsiveValue(spacing.margin),
  },
  body: {
    fontSize: getResponsiveValue(typography.body),
  },
});

export default ResponsiveExample; 