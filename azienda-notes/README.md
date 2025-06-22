# mynote

## Deployment Guide


This guide explains how to run and deploy the project from the source code.

### 1. Prerequisites

Before starting, make sure you have installed:

- **Node.js** (version 18 or higher recommended)
- **npm** (comes with Node.js)
- **Expo CLI** (for running React Native projects)
- **Git** (to clone the repository)

### 2. Clone the repository

Open your terminal and run:

```bash
git clone git@github.com:yosraessid/mynote.git
cd mynote/azienda-notes
```

### 3. Install dependencies

Install all required packages:

```bash
npm install
```

### 4. Start the project

To start the Expo development server, run:

```bash
npx expo start
```

- You can open the app on your phone with the Expo Go app (scan the QR code).
- Or press `w` in the terminal to open the app in your web browser.

### 5. Technologies used

- **React Native** (with Expo)
- **AsyncStorage** for local data storage
- **@expo-google-fonts/montserrat** for custom fonts
- **React Navigation** for navigation between screens

### 6. Additional actions

- If you encounter errors, try cleaning the cache:
  ```bash
  npx expo start -c
  ```
- Make sure your device or emulator is connected to the same Wi-Fi network as your computer for mobile testing.

### 7. Build for production (optional)

To create a production build for web:

```bash
npx expo build:web
```

For more information, see the [Expo documentation](https://docs.expo.dev/).

---

**If you have any issues, check the terminal for error messages or contact the project maintainer.**