import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import AuthStack from './navigation/AuthStack.js';
import AppStack from './navigation/AppStack.js';
import AppNav from './navigation/AppNav.js';
import { AuthProvider } from './context/AuthContext.js';

function App() {
  return (
    <AuthProvider>
      <AppNav />
    </AuthProvider>
  );
}

export default App;