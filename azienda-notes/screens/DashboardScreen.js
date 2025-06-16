import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Button, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getNotes } from '../utils/storage';

const { width } = Dimensions.get('window');
const itemWidth = (width - 80) / 3; // Ajusté pour 3 colonnes (padding total de 60px pour 2 espaces entre 3 colonnes, plus les paddings du conteneur)

const DashboardScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);

  const fetchNotes = async () => {
    const storedNotes = await getNotes();
    setNotes(storedNotes);
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      return () => {};
    }, [])
  );

  const renderItem = ({ item }) => {
    const date = new Date(item.dateTime);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit'
    });

    return (
      <TouchableOpacity 
        style={[styles.noteCard, { backgroundColor: getImportanceColor(item.importance), width: itemWidth }]} 
        onPress={() => navigation.navigate('Note', { note: item })}
      >
        <Text style={styles.noteTitle}>{item.title}</Text>
        <Text style={styles.noteContent}>{item.content.substring(0, 100)}{item.content.length > 100 ? '...' : ''}</Text>
        <Text style={styles.noteImportance}>Importance: {item.importance}</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateTimeText}>{formattedDate}</Text>
          <Text style={styles.dateTimeText}>{formattedTime}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getImportanceColor = (importance) => {
    switch (importance) {
      case 'Important':
        return '#F45889'; // Corresponds to the pink color in the brief
      case 'Normal':
        return '#456990'; // Corresponds to the blue color
      case 'Low':
        return '#7EE4EC'; // Corresponds to the light blue color
      default:
        return '#D3D3D3'; // Grey for unknown importance
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Notes</Text>
        <Button 
          title="ADD"
          onPress={() => navigation.navigate('Form')}
          color="#114B5F" // A dark blue from your palette
        />
      </View>

      {notes.length === 0 ? (
        <Text style={styles.noNotesText}>No notes created yet. Click ADD to create one!</Text>
      ) : (
        <FlatList
          data={notes}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={3} // Afficher en 3 colonnes
          columnWrapperStyle={styles.row} // Style pour chaque ligne de colonnes
          contentContainerStyle={styles.notesList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FDD4CA', // A light peach from your palette
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#114B5F', // A dark blue from your palette
  },
  noNotesText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#456990',
  },
  notesList: {
    paddingBottom: 20,
  },
  row: {
    flex: 1,
    justifyContent: "space-between", // Répartir l'espace entre les cartes
    marginBottom: 15,
    marginHorizontal: 10, // Ajout d'un peu de marge horizontale pour l'alignement
  },
  noteCard: {
    padding: 15,
    borderRadius: 8,
    elevation: 3, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 15, // Remettre un marginBottom sur la carte elle-même
  },
  noteTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  noteDate: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  noteContent: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    flexGrow: 1,
  },
  noteImportance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  noteDateBottom: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    textAlign: 'right',
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
  },
});

export default DashboardScreen; 