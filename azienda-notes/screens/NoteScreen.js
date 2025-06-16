import React, { useCallback, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import ConfirmationModal from '../components/ConfirmationModal';
import { getNotes, saveNotes } from '../utils/storage';

const NoteScreen = ({ navigation, route }) => {
  const { note } = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${formattedDate} à ${formattedTime}`;
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Important':
        return '#F45889'; // Rose
      case 'Normal':
        return '#456990'; // Bleu
      case 'Low':
        return '#7EE4EC'; // Bleu clair
      default:
        return '#D3D3D3'; // Gris par défaut
    }
  };

  const deleteNote = useCallback(async () => {
    console.log('[deleteNote] Début de la suppression pour la note avec ID:', note.id);
    setIsModalVisible(false); // Cacher la modale après confirmation
    try {
      const currentNotes = await getNotes();
      console.log('[deleteNote] Notes actuelles récupérées (taille):', currentNotes.length);

      const noteExists = currentNotes.some(n => n.id === note.id);
      if (!noteExists) {
        console.log('[deleteNote] La note n\'existe plus. Redirection.');
        Alert.alert('Erreur', 'La note n\'existe plus.');
        navigation.goBack();
        return;
      }

      const updatedNotes = currentNotes.filter(n => n.id !== note.id);
      console.log('[deleteNote] Notes après filtrage (nouvelle taille):', updatedNotes.length);
      
      await saveNotes(updatedNotes);
      console.log('[deleteNote] Notes sauvegardées avec succès.');

      console.log('[deleteNote] Note supprimée. Redirection vers le Dashboard.');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' }],
      });
    } catch (error) {
      console.error('[deleteNote] Erreur inattendue lors de la suppression:', error);
      Alert.alert(
        'Erreur',
        'Impossible de supprimer la note. Veuillez réessayer.'
      );
    }
  }, [note.id, navigation]);

  const handleDelete = useCallback(() => {
    console.log('[handleDelete] Le bouton Supprimer a été pressé. Affichage de la modale.');
    setIsModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.date}>Créée le : {formatDateTime(note.dateTime)}</Text>
      <Text style={[styles.importance, { color: getImportanceColor(note.importance) }]}>Importance : {note.importance}</Text>
      <Text style={styles.content}>{note.content}</Text>

      <View style={styles.buttonContainer}>
        <Button 
          title="Modifier" 
          onPress={() => navigation.navigate('Form', { note: note })} 
          color="#114B5F"
        />
        <Button 
          title="Supprimer" 
          onPress={handleDelete} 
          color="red"
        />
      </View>

      <Button 
        title="Retour au tableau de bord" 
        onPress={() => navigation.goBack()} 
        color="#456990"
      />

      <ConfirmationModal
        visible={isModalVisible}
        title="Confirmation de suppression"
        message="Êtes-vous sûr de vouloir supprimer cette note ? Cette action est irréversible."
        onConfirm={deleteNote}
        onCancel={() => setIsModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDD4CA',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#114B5F',
  },
  date: {
    fontSize: 14,
    color: '#456990',
    marginBottom: 5,
  },
  importance: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#456990',
    marginBottom: 15,
  },
  content: {
    fontSize: 18,
    color: '#114B5F',
    lineHeight: 24,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default NoteScreen; 