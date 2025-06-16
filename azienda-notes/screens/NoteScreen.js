import React, { useCallback, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import ConfirmationModal from '../components/ConfirmationModal';
import { getResponsiveValue, spacing, typography } from '../styles/responsive';
import { getNotes, saveNotes } from '../utils/storage';

const NoteScreen = ({ navigation, route }) => {
  const { note } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} at ${formattedTime}`;
  };

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

  const deleteNote = useCallback(async () => {
    console.log('[deleteNote] Starting deletion for note with ID:', note.id);
    setIsModalVisible(false); // Hide modal after confirmation
    try {
      const currentNotes = await getNotes();
      console.log('[deleteNote] Current notes retrieved (size):', currentNotes.length);

      const noteExists = currentNotes.some(n => n.id === note.id);
      if (!noteExists) {
        console.log('[deleteNote] Note no longer exists. Redirecting.');
        Alert.alert('Error', 'The note no longer exists.');
        navigation.goBack();
        return;
      }

      const updatedNotes = currentNotes.filter(n => n.id !== note.id);
      console.log('[deleteNote] Notes after filtering (new size):', updatedNotes.length);
      
      await saveNotes(updatedNotes);
      console.log('[deleteNote] Notes saved successfully.');

      console.log('[deleteNote] Note deleted. Redirecting to Dashboard.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('[deleteNote] Unexpected error during deletion:', error);
      Alert.alert(
        'Error',
        'Unable to delete the note. Please try again.'
      );
    }
  }, [note.id, navigation]);

  const handleDelete = useCallback(() => {
    console.log('[handleDelete] Delete button pressed. Showing modal.');
    setIsModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>Created on: {formatDateTime(note.dateTime)}</Text>
      <Text style={[styles.importance, { color: getImportanceColor(note.importance) }]}>Importance: {note.importance}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <View style={styles.buttonContainer}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: getResponsiveValue(spacing.padding),
    backgroundColor: '#FDD4CA',
  },
  title: {
    fontSize: getResponsiveValue(typography.h1),
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#114B5F',
  },
  date: {
    fontSize: getResponsiveValue(typography.small),
    color: '#456990',
    marginBottom: 5,
  },
  importance: {
    fontSize: getResponsiveValue(typography.body),
    fontWeight: 'bold',
    color: '#456990',
    marginBottom: 15,
  },
  content: {
    fontSize: getResponsiveValue(typography.body),
    color: '#114B5F',
    lineHeight: 24,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: getResponsiveValue(spacing.margin),
    width: '100%',
  },
  backButton: {
    marginTop: getResponsiveValue(spacing.margin),
  }
});

export default NoteScreen; 