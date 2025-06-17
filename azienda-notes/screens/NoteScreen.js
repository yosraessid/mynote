// NoteScreen.js
// This screen displays the details of a single note. The user can edit or delete the note.

import React, { useCallback, useState } from 'react'; // Import React and hooks
import { Alert, Button, StyleSheet, Text, View } from 'react-native'; // Import React Native components
import ConfirmationModal from '../components/ConfirmationModal'; // Import the confirmation modal component
import { getResponsiveValue, spacing, typography } from '../styles/responsive'; // Import responsive styles
import { getNotes, saveNotes } from '../utils/storage'; // Import functions to get and save notes

const NoteScreen = ({ navigation, route }) => { // Main component for the note detail screen
  const { note } = route.params; // Get the note from navigation params
  const [isModalVisible, setIsModalVisible] = useState(false); // State for showing the confirmation modal

  // Function to format the date and time for display
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString); // Convert string to Date object
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} at ${formattedTime}`; // Return formatted date and time
  };

  // Function to get the color for each importance level
  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Important':
        return '#F45889'; // Pink
      case 'Normal':
        return '#456990'; // Blue
      case 'Low':
        return '#7EE4EC'; // Light Blue
      default:
        return '#D3D3D3'; // Default Gray
    }
  };

  // Function to delete the note
  const deleteNote = useCallback(async () => {
    console.log('[deleteNote] Starting deletion for note with ID:', note.id);
    setIsModalVisible(false); // Hide modal after confirmation
    try {
      const currentNotes = await getNotes(); // Get all notes
      console.log('[deleteNote] Current notes retrieved (size):', currentNotes.length);

      const noteExists = currentNotes.some(n => n.id === note.id); // Check if note exists
      if (!noteExists) {
        console.log('[deleteNote] Note no longer exists. Redirecting.');
        Alert.alert('Error', 'The note no longer exists.'); // Show error if note is missing
        navigation.goBack(); // Go back to previous screen
        return;
      }

      const updatedNotes = currentNotes.filter(n => n.id !== note.id); // Remove the note
      console.log('[deleteNote] Notes after filtering (new size):', updatedNotes.length);
      
      await saveNotes(updatedNotes); // Save updated notes
      console.log('[deleteNote] Notes saved successfully.');

      console.log('[deleteNote] Note deleted. Redirecting to Dashboard.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }], // Go back to dashboard
      });
    } catch (error) {
      console.error('[deleteNote] Unexpected error during deletion:', error);
      Alert.alert(
        'Error',
        'Unable to delete the note. Please try again.' // Show error if deletion fails
      );
    }
  }, [note.id, navigation]);

  // Function to show the confirmation modal
  const handleDelete = useCallback(() => {
    console.log('[handleDelete] Delete button pressed. Showing modal.');
    setIsModalVisible(true); // Show modal
  }, []);

  return (
    <View style={styles.container}> {/* Main container for the note detail */}
      <View style={styles.noteBox}> {/* White box around the note */}
        <Text style={styles.title}>{note.title}</Text> {/* Note title */}
        <Text style={styles.date}>Created on: {formatDateTime(note.dateTime)}</Text> {/* Date and time */}
        <Text style={[styles.importance, { color: getImportanceColor(note.importance) }]}>Importance: {note.importance}</Text> {/* Importance label */}
        <Text style={styles.content}>{note.content}</Text> {/* Note content */}

        <View style={styles.buttonContainerWithSpace}> {/* Container for buttons */}
          <View style={styles.buttonContainer}> {/* Row for Edit and Delete buttons */}
            <Button 
              title="Edit" 
              onPress={() => navigation.navigate('Form', { note: note })} 
              color="#114B5F"
            />
            <Button 
              title="Delete" 
              onPress={handleDelete} 
              color="red"
            />
          </View>

          <Button 
            title="Back to Dashboard" 
            onPress={() => navigation.goBack()} 
            color="#456990"
            style={styles.backButton}
          />
        </View>
      </View>

      <ConfirmationModal
        visible={isModalVisible}
        title="Delete Confirmation"
        message="Are you sure you want to delete this note? This action cannot be undone."
        onConfirm={deleteNote}
        onCancel={() => setIsModalVisible(false)}
      />
    </View>
  );
};

// Styles for the note detail screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take all available space
    padding: getResponsiveValue(spacing.padding), // Responsive padding
    backgroundColor: '#FFD4CA', // Light pink background
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  noteBox: {
    backgroundColor: '#fff', // White background for the note
    borderRadius: 12, // Rounded corners
    padding: 90, // Space inside the box
    margin: 20, // Space around the box
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.08, // Shadow opacity
    shadowRadius: 8, // Shadow blur
    elevation: 2, // Shadow for Android
    width: '100%', // Full width
    maxWidth: 900, // Maximum width
  },
  title: {
    fontSize: getResponsiveValue(typography.h1), // Responsive title size
    fontWeight: 'bold', // Bold text
    marginBottom: 10, // Space below
    color: '#000', // Black color
    fontFamily: 'Montserrat_700Bold', // Font
  },
  date: {
    fontSize: getResponsiveValue(typography.small), // Responsive date size
    color: '#FFD4CA', // Pink color
    marginBottom: 5, // Space below
    fontFamily: 'Montserrat_400Regular', // Font
  },
  importance: {
    fontSize: getResponsiveValue(typography.body), // Responsive importance size
    fontWeight: 'bold', // Bold text
    color: '#456990', // Blue color (default)
    marginBottom: 15, // Space below
    fontFamily: 'Montserrat_700Bold', // Font
  },
  content: {
    fontSize: getResponsiveValue(typography.body), // Responsive content size
    color: '#000', // Black color
    lineHeight: 24, // Space between lines
    flex: 1, // Take available space
    fontFamily: 'Montserrat_400Regular', // Font
  },
  buttonContainer: {
    flexDirection: 'row', // Row layout
    justifyContent: 'space-around', // Space between buttons
    marginBottom: getResponsiveValue(spacing.margin), // Responsive space below
    width: '100%', // Full width
  },
  buttonContainerWithSpace: {
    marginTop: 60, // Space above
  },
  backButton: {
    marginTop: getResponsiveValue(spacing.margin), // Responsive space above
  }
});

export default NoteScreen; // Export the component 