import React from 'react';
import { StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthStack from './navigation/AuthStack.js';
// import AppStack from './navigation/AppStack.js';

function App() {
  return (
    <NavigationContainer>
      <StatusBar />
      {/* <AppStack /> */}
      <AuthStack />
    </NavigationContainer>
  );
}

export default App;