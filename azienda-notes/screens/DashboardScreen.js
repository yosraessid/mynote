// DashboardScreen.js
// This screen displays all the user's notes in a grid. Notes are stored locally on the device.

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { breakpoints, getResponsiveValue, spacing, typography } from '../styles/responsive';
import { getNotes } from '../utils/storage';

// Get the width of the device's screen
const { width } = Dimensions.get('window');
// Set the maximum width for the white card container
const CARD_CONTAINER_WIDTH = width > getResponsiveValue({mobile: 350, tablet: 700, desktop: 900, extraLarge: 1200}) ? getResponsiveValue({mobile: 350, tablet: 700, desktop: 900, extraLarge: 1200}) : width - 40;
// Calculate the width of each note card (responsive columns)
const numColumns = width >= breakpoints.desktopLarge ? 3 : width >= breakpoints.tabletLarge ? 2 : 1;
const itemWidth = (CARD_CONTAINER_WIDTH - 40) / numColumns;

// Function to shorten long text with ...
const truncate = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const DashboardScreen = ({ navigation }) => {
  // State to store all notes
  const [notes, setNotes] = useState([]);

  // Function to load notes from local storage
  const fetchNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  // Reload notes every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      return () => {};
    }, [])
  );

  // Render each note card
  const renderItem = ({ item }) => {
    // Format the date and time for display
    const date = new Date(item.dateTime);
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });

    return (
      // Each note is a colored card. Press to open the note details.
      <TouchableOpacity 
        style={[styles.noteCard, { backgroundColor: getImportanceColor(item.importance), width: itemWidth }]} 
        onPress={() => navigation.navigate('Note', { note: item })}
      >
        {/* Note title */}
        <Text style={styles.noteTitle}>{item.title}</Text>
        {/* Note content (truncated if too long) */}
        <Text style={styles.noteContent}>{truncate(item.content, 100)}</Text>
        {/* Importance label */}
        <Text style={styles.noteImportance}>Importance: {item.importance}</Text>
        {/* Date and time at the bottom of the card */}
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>{formattedDate}</Text>
          <Text style={styles.dateTimeText}>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Choose the card color based on importance
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Important':
        return '#F45889'; // Pink for important notes
      case 'Normal':
        return '#456990'; // Blue for normal notes
      case 'Low':
        return '#7EE4EC'; // Light blue for low importance
      default:
        return '#D3D3D3'; // Grey for unknown importance
    }
  };

  return (
    <View style={styles.pageContainer}>
      {/* Add button at the top */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('Form')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>ADD</Text>
        </TouchableOpacity>
      </View>
      {/* White card container for all notes */}
      <View style={styles.cardContainer}>
        <Text style={styles.cardTitle}>Your Notes</Text>
        {/* Show message if there are no notes */}
        {notes.length === 0 ? (
          <Text style={styles.noNotesText}>No notes created yet. Click ADD to create one!</Text>
        ) : (
          // List of notes in responsive columns
          <FlatList
            data={notes}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={numColumns}
            columnWrapperStyle={numColumns > 1 ? styles.row : null}
            contentContainerStyle={styles.notesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
};

// Styles for the dashboard and note cards
const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: '#FFD4CA', // Light pink background
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: getResponsiveValue(spacing.margin),
  },
  addButtonContainer: {
    marginBottom: getResponsiveValue(spacing.margin),
    alignItems: 'center',
    width: '100%',
  },
  cardContainer: {
    backgroundColor: '#fff', // White background for notes area
    borderRadius: 10,
    padding: getResponsiveValue(spacing.padding),
    width: CARD_CONTAINER_WIDTH,
    minHeight: 300,
    alignItems: 'center',
    marginVertical: getResponsiveValue(spacing.margin),
    marginHorizontal: getResponsiveValue(spacing.margin),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: getResponsiveValue(typography.h1),
    color: '#FFD4CA',
    fontWeight: 'bold',
    marginBottom: getResponsiveValue(spacing.margin),
    textAlign: 'center',
    fontFamily: 'Montserrat_700Bold',
  },
  noNotesText: {
    textAlign: 'center',
    marginTop: getResponsiveValue(spacing.margin),
    fontSize: getResponsiveValue(typography.body),
    color: '#FFD4CA',
    fontFamily: 'Montserrat_400Regular',
  },
  notesList: {
    paddingBottom: getResponsiveValue(spacing.margin),
    alignItems: 'center',
  },
  row: {
    justifyContent: 'center',
    marginBottom: getResponsiveValue(spacing.margin),
  },
  noteCard: {
    padding: getResponsiveValue(spacing.padding),
    borderRadius: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    marginHorizontal: getResponsiveValue(spacing.margin),
    marginBottom: 10,
    maxWidth: 400,
    width: '100%',
    minHeight: 220, // Minimum height for better content display
  },
  noteTitle: {
    fontSize: getResponsiveValue(typography.h2),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Montserrat_700Bold',
  },
  noteContent: {
    fontSize: getResponsiveValue(typography.body),
    color: '#fff',
    marginBottom: 6,
    flexGrow: 1,
    fontFamily: 'Montserrat_400Regular',
  },
  noteImportance: {
    fontSize: getResponsiveValue(typography.body),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Montserrat_700Bold',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)', // Subtle line
  },
  dateTimeText: {
    fontSize: getResponsiveValue(typography.small),
    color: '#fff',
    opacity: 0.9,
    fontFamily: 'Montserrat_400Regular',
  },
  dashboardTitle: {
    color: '#456990',
    fontSize: getResponsiveValue(typography.h1),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: getResponsiveValue(spacing.margin),
    marginTop: getResponsiveValue(spacing.margin),
    fontFamily: 'Montserrat_700Bold',
  },
  addButton: {
    backgroundColor: '#456990',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontFamily: 'Montserrat_700Bold',
  },
});

export default DashboardScreen; 