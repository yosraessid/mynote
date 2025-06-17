// App.js
// This is the main entry point of the app. It sets up navigation, fonts, and splash screen.

import { Montserrat_400Regular, Montserrat_700Bold, useFonts } from '@expo-google-fonts/montserrat'; // Import Montserrat fonts
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for local storage
import { NavigationContainer } from '@react-navigation/native'; // Import navigation container
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import stack navigator
import * as SplashScreen from 'expo-splash-screen'; // Import splash screen handling
import React, { useEffect, useState } from 'react'; // Import React and hooks

import DashboardScreen from './screens/DashboardScreen'; // Import dashboard screen
import FormScreen from './screens/FormScreen'; // Import form screen
import NoteScreen from './screens/NoteScreen'; // Import note detail screen

const Stack = createNativeStackNavigator(); // Create a stack navigator
const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'; // Key for saving navigation state

export default function App() { // Main App component
  const [isReady, setIsReady] = useState(false); // State to check if app is ready
  const [initialState, setInitialState] = useState(); // State for navigation initial state
  const [fontsLoaded] = useFonts({ // Load Montserrat fonts
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => { // Effect to restore navigation state from storage
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY); // Get saved navigation state
        const state = savedStateString ? JSON.parse(savedStateString) : undefined; // Parse state
        if (state !== undefined) {
          setInitialState(state); // Set initial state if found
        }
      } finally {
        setIsReady(true); // Mark app as ready
      }
    };
    restoreState(); // Call the function
  }, []);

  useEffect(() => { // Effect to hide splash screen when fonts and app are ready
    if (fontsLoaded && isReady) {
      SplashScreen.hideAsync(); // Hide splash screen
    }
  }, [fontsLoaded, isReady]);

  if (!isReady || !fontsLoaded) {
    return null; // Or a loading indicator (app is not ready yet)
  }

  return (
    <NavigationContainer
      initialState={initialState} // Set initial navigation state
      onStateChange={state =>
        AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state)) // Save navigation state on change
      }
    >
      <Stack.Navigator initialRouteName="Dashboard"> {/* Stack of screens */}
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{
            title: 'Dashboard', // Title in the header
            headerTitleAlign: 'left', // Align title to the left
            headerTitleStyle: {
              color: '#456990', // Blue color
              fontSize: 22, // Title size
              fontWeight: 'bold', // Bold text
              fontFamily: 'Montserrat_700Bold', // Font
            },
            headerLeft: () => null, // Remove back arrow
          }}
        />
        <Stack.Screen 
          name="Form" 
          component={FormScreen} 
          options={{
            title: 'Form', // Title in the header
            headerTitleAlign: 'left', // Align title to the left
            headerTitleStyle: {
              color: '#456990', // Blue color
              fontSize: 22, // Title size
              fontWeight: 'bold', // Bold text
              fontFamily: 'Montserrat_700Bold', // Font
            },
            headerTintColor: '#456990', // Color for back arrow
          }}
        />
        <Stack.Screen 
          name="Note" 
          component={NoteScreen} 
          options={{
            headerShown: true, // Show header
            headerTitle: 'Note', // Title in the header
            headerTitleStyle: {
              color: '#456990', // Blue color
              fontSize: 24, // Title size
              fontFamily: 'Montserrat_700Bold', // Font
            },
            headerStyle: {
              backgroundColor: '#FFFFFF', // White background for header
            },
            headerTintColor: '#456990', // Color for back arrow
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} // End of App component 