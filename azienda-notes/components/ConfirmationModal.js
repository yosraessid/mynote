// ConfirmationModal.js
// This component shows a confirmation modal (popup) with a message and two buttons: Cancel and Delete.

import React from 'react'; // Import React
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Import React Native components

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel }) => { // Modal component with props
  return (
    <Modal
      animationType="fade" // Fade in/out animation
      transparent={true} // Modal background is transparent
      visible={visible} // Show or hide the modal
      onRequestClose={onCancel} // Handle Android back button
    >
      <View style={styles.centeredView}> {/* Center the modal on the screen */}
        <View style={styles.modalView}> {/* White box for the modal */}
          <Text style={styles.modalTitle}>{title}</Text> {/* Modal title */}
          <Text style={styles.modalMessage}>{message}</Text> {/* Modal message */}

          <View style={styles.buttonContainer}> {/* Row for the two buttons */}
            <TouchableOpacity
              style={[styles.button, styles.buttonCancel]}
              onPress={onCancel} // Cancel button
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.buttonConfirm]}
              onPress={onConfirm} // Confirm (Delete) button
            >
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1, // Take all available space
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
  },
  modalView: {
    margin: 20, // Space around the modal
    backgroundColor: 'white', // White background
    borderRadius: 10, // Rounded corners
    padding: 35, // Space inside the modal
    alignItems: 'center', // Center content
    shadowColor: '#000', // Shadow color
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25, // Shadow opacity
    shadowRadius: 4, // Shadow blur
    elevation: 5, // Shadow for Android
    width: '80%', // Modal width
    maxWidth: 400, // Maximum width
  },
  modalTitle: {
    marginBottom: 15, // Space below the title
    textAlign: 'center', // Centered text
    fontSize: 20, // Title size
    fontWeight: 'bold', // Bold text
    color: '#114B5F', // Blue color
  },
  modalMessage: {
    marginBottom: 20, // Space below the message
    textAlign: 'center', // Centered text
    fontSize: 16, // Message size
    color: '#456990', // Blue color
  },
  buttonContainer: {
    flexDirection: 'row', // Row layout
    justifyContent: 'space-around', // Space between buttons
    width: '100%', // Full width
  },
  button: {
    borderRadius: 8, // Rounded corners
    padding: 10, // Space inside the button
    elevation: 2, // Shadow for Android
    flex: 1, // Take equal space
    marginHorizontal: 5, // Space between buttons
  },
  buttonCancel: {
    backgroundColor: '#456990', // Blue background for Cancel
  },
  buttonConfirm: {
    backgroundColor: '#FF3B30', // Red background for Delete
  },
  textStyle: {
    color: 'white', // White text
    fontWeight: 'bold', // Bold text
    textAlign: 'center', // Centered text
    fontSize: 16, // Text size
  },
});

export default ConfirmationModal; // Export the component 