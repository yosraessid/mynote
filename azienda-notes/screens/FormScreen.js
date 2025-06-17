// FormScreen.js
// This screen allows the user to add or edit a note. The note is saved locally on the device.

import React, { useEffect, useState } from 'react'; // Import React and hooks
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native'; // Import React Native components
import { getNotes, saveNotes } from '../utils/storage'; // Import functions to get and save notes

const FormScreen = ({ navigation, route }) => { // Main component for the form screen
  // State variables for the note fields
  const [title, setTitle] = useState(''); // Note title
  const [content, setContent] = useState(''); // Note content
  const [importance, setImportance] = useState('Normal'); // Note importance
  const [currentNoteId, setCurrentNoteId] = useState(null); // Note ID (for editing)
  const [screenTitle, setScreenTitle] = useState('Add New Note'); // Title at the top of the screen

  // When the screen is opened, check if we are editing a note or creating a new one
  useEffect(() => {
    if (route.params?.note) { // If a note is passed in params (edit mode)
      const { note } = route.params;
      setTitle(note.title); // Set the title
      setContent(note.content); // Set the content
      setImportance(note.importance || 'Normal'); // Set the importance
      setCurrentNoteId(note.id); // Set the note ID
      setScreenTitle('Edit Note'); // Change the screen title
    } else { // If no note is passed (add mode)
      setTitle('');
      setContent('');
      setImportance('Normal');
      setCurrentNoteId(null);
      setScreenTitle('Add New Note');
    }
  }, [route.params?.note]);

  // Function to change the importance when a button is pressed
  const handleImportanceChange = (newImportance) => {
    setImportance(newImportance);
  };

  // Function to save the note (add or update)
  const handleSave = async () => {
    if (!title.trim()) { // If the title is empty, show an error
      Alert.alert('Error', 'Note title cannot be empty.');
      return;
    }

    try {
      const newNote = {
        id: currentNoteId || Date.now().toString(), // Use existing ID or create a new one
        title,
        content,
        dateTime: new Date().toISOString(), // Save the current date and time
        importance,
      };

      let existingNotes = await getNotes(); // Get all notes
      if (currentNoteId) { // If editing, update the note
        existingNotes = existingNotes.map(note => 
          note.id === currentNoteId ? newNote : note
        );
      } else { // If adding, add the new note
        existingNotes.push(newNote);
      }
      
      await saveNotes(existingNotes); // Save all notes
      Alert.alert('Success', 'Note saved!'); // Show success message
      navigation.navigate('Dashboard'); // Go back to the dashboard
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.'); // Show error message
    }
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
        return '#456990'; // Default Blue
    }
  };

  // Function to get the display label for importance in English
  const getImportanceLabel = (importance) => {
    switch (importance) {
      case 'Important':
        return 'Important';
      case 'Normal':
        return 'Normal';
      case 'Low':
        return 'Low';
      default:
        return importance;
    }
  };

  return (
    <View style={styles.container}> {/* Main container for the form */}
      <View style={styles.formBox}> {/* White box around the form */}
        <Text style={styles.screenHeaderTitle}>{screenTitle}</Text> {/* Title at the top */}
        <Text style={styles.label}>Title</Text> {/* Label for the title field */}
        <TextInput
          style={styles.input}
          placeholder="Titre de la note"
          placeholderTextColor="#A0A0A0"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Content</Text> {/* Label for the content field */}
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Contenu de la note"
          placeholderTextColor="#A0A0A0"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <View style={styles.importanceLabelContainer}> {/* Row for importance label and value */}
          <Text style={styles.label}>Importance: </Text>
          <Text style={[styles.importanceValue, { color: getImportanceColor(importance) }]}> {/* Importance value in color */}
            {getImportanceLabel(importance)}
          </Text>
        </View>
        <View style={styles.importanceButtons}> {/* Buttons to select importance */}
          <Button 
            title="Important" 
            onPress={() => handleImportanceChange('Important')} 
            color={importance === 'Important' ? '#F45889' : '#F4588990'}
          />
          
          <Button 
            title="Normal" 
            onPress={() => handleImportanceChange('Normal')} 
            color={importance === 'Normal' ? '#456990' : '#45699090'}
          />
          
          <Button 
            title="Low" 
            onPress={() => handleImportanceChange('Low')} 
            color={importance === 'Low' ? '#7EE4EC' : '#7EE4EC90'}
          />
        </View>

        <View style={styles.actionButtons}> {/* Row for Cancel and Save buttons */}
          <Button 
            title="Cancel" 
            onPress={() => navigation.goBack()} 
            color="red"
          />
          <Button 
            title="Save Note" 
            onPress={handleSave} 
            color={getImportanceColor(importance)}
          />
        </View>
      </View>
    </View>
  );
};

// Styles for the form screen
const styles = StyleSheet.create({
  container: {
    flex: 1, // Take all available space
    padding: 20, // Space around the form
    backgroundColor: '#FFD4CA', // Light pink background
    alignItems: 'center', // Center horizontally
    justifyContent: 'center', // Center vertically
  },
  formBox: {
    backgroundColor: '#fff', // White background for the form
    borderRadius: 12, // Rounded corners
    padding: 30, // Space inside the box
    width: '100%', // Full width
    maxWidth: 500, // Maximum width
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.08, // Shadow opacity
    shadowRadius: 8, // Shadow blur
    elevation: 2, // Shadow for Android
  },
  screenHeaderTitle: {
    fontSize: 24, // Title size
    fontWeight: 'bold', // Bold text
    marginBottom: 20, // Space below
    textAlign: 'center', // Centered text
    color: '#114B5F', // Blue color
    fontFamily: 'Montserrat_700Bold', // Font
  },
  label: {
    fontSize: 16, // Label size
    fontWeight: 'bold', // Bold text
    marginBottom: 5, // Space below
    marginTop: 10, // Space above
    color: '#000000', // Black color
    fontFamily: 'Montserrat_400Regular', // Font
  },
  input: {
    borderWidth: 1, // Border width
    borderColor: '#ddd', // Border color
    padding: 10, // Space inside the input
    marginBottom: 10, // Space below
    borderRadius: 5, // Rounded corners
    fontSize: 16, // Text size
    fontFamily: 'Montserrat_400Regular', // Font
  },
  contentInput: {
    minHeight: 100, // Minimum height for content
    textAlignVertical: 'top', // Start text at the top
    fontFamily: 'Montserrat_400Regular', // Font
  },
  importanceLabelContainer: {
    flexDirection: 'row', // Row layout
    alignItems: 'center', // Center vertically
    marginTop: 10, // Space above
  },
  importanceValue: {
    fontSize: 16, // Importance value size
    fontWeight: 'bold', // Bold text
    fontFamily: 'Montserrat_400Regular', // Font
  },
  importanceButtons: {
    flexDirection: 'row', // Row layout
    justifyContent: 'space-around', // Space between buttons
    marginBottom: 20, // Space below
    marginTop: 10, // Space above
  },
  actionButtons: {
    flexDirection: 'row', // Row layout
    justifyContent: 'space-between', // Space between buttons
    marginTop: 100, // Space above
  },
  importanceButtonText: {
    color: '#fff', // White text
    fontWeight: 'bold', // Bold text
    fontSize: 16, // Text size
    letterSpacing: 1, // Space between letters
    fontFamily: 'Montserrat_700Bold', // Font
  },
  selectedImportanceButtonText: {
    textDecorationLine: 'underline', // Underline text
    fontFamily: 'Montserrat_700Bold', // Font
  },
});

export default FormScreen; // Export the component 