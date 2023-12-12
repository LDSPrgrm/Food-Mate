import React, {useContext}  from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import AuthStack from '../navigation/AuthStack.js';
import AppStack from '../navigation/AppStack.js';
import { AuthContext } from '../context/AuthContext.js';

function AppNav() {
  const {isLoading, userToken} = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <NavigationContainer>
    <StatusBar />
        {userToken !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default AppNav;