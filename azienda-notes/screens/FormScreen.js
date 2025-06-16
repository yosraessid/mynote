import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { getNotes, saveNotes } from '../utils/storage';

const FormScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [importance, setImportance] = useState('Normal');
  const [currentNoteId, setCurrentNoteId] = useState(null);
  const [screenTitle, setScreenTitle] = useState('Add New Note');

  useEffect(() => {
    if (route.params?.note) {
      const { note } = route.params;
      setTitle(note.title);
      setContent(note.content);
      setImportance(note.importance || 'Normal');
      setCurrentNoteId(note.id);
      setScreenTitle('Edit Note');
    } else {
      if (currentNoteId !== null) {
        setTitle('');
        setContent('');
        setImportance('Normal');
        setCurrentNoteId(null);
      }
      setScreenTitle('Add New Note');
    }
    console.log('[FormScreen - useEffect] Importance initiale/chargée:', importance);
  }, [route.params?.note, importance, currentNoteId]);

  const handleImportanceChange = (newImportance) => {
    setImportance(newImportance);
    console.log('[FormScreen - handleImportanceChange] Nouvelle importance sélectionnée:', newImportance);
  };

  const handleSave = async () => {
    console.log('[FormScreen - handleSave] Tentative de sauvegarde de la note. Importance actuelle:', importance);
    if (!title.trim()) {
      Alert.alert('Error', 'Note title cannot be empty.');
      return;
    }

    const newNote = {
      id: currentNoteId || Date.now().toString(),
      title,
      content,
      dateTime: new Date().toISOString(),
      importance,
    };

    let existingNotes = await getNotes();
    if (currentNoteId) {
      existingNotes = existingNotes.map(note => 
        note.id === currentNoteId ? newNote : note
      );
    } else {
      existingNotes.push(newNote);
    }
    
    await saveNotes(existingNotes);
    Alert.alert('Success', 'Note saved!');
    navigation.navigate('Dashboard');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.screenHeaderTitle}>{screenTitle}</Text>
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Content</Text>
      <TextInput
        style={[styles.input, styles.contentInput]}
        placeholder="Note Content"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <Text style={styles.label}>Importance: {importance}</Text>
      <View style={styles.importanceButtons}>
        <Button 
          title="Important" 
          onPress={() => handleImportanceChange('Important')} 
          color="#FF6347"
        />
        
        <Button 
          title="Normal" 
          onPress={() => handleImportanceChange('Normal')} 
          color="#4682B4"
        />
        
        <Button 
          title="Low" 
          onPress={() => handleImportanceChange('Low')} 
          color="#32CD32"
        />
      </View>

      <View style={styles.actionButtons}>
        <Button 
          title="Cancel" 
          onPress={() => navigation.goBack()} 
          color="red"
        />
        <Button 
          title="Save Note" 
          onPress={handleSave} 
          color="#114B5F"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  screenHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#114B5F',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  contentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  importanceButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    marginTop: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 100,
  },
});

export default FormScreen; 