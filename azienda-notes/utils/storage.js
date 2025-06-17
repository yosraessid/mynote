import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage

const NOTES_KEY = 'my_notes'; // A unique key for storing notes

// Function to get all notes from local storage
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY); // Get the notes as a JSON string
    return jsonValue != null ? JSON.parse(jsonValue) : [];   // Parse and return as array, or empty array if nothing
  } catch (e) {
    console.error('Error getting notes', e); // Log error if something goes wrong
    return [];
  }
};

// Function to save all notes to local storage
export const saveNotes = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes); // Convert notes array to JSON string
    await AsyncStorage.setItem(NOTES_KEY, jsonValue); // Save the string in storage
  } catch (e) {
    console.error('Error saving notes', e); // Log error if something goes wrong
  }
}; 