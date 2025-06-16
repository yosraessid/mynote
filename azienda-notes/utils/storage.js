import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'my_notes'; // Une clé unique pour nos notes

// Fonction pour récupérer toutes les notes
export const getNotes = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error getting notes', e);
    return [];
  }
};

// Fonction pour sauvegarder toutes les notes
export const saveNotes = async (notes) => {
  try {
    const jsonValue = JSON.stringify(notes);
    await AsyncStorage.setItem(NOTES_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving notes', e);
  }
}; 