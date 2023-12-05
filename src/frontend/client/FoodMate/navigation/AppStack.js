import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import CustomDrawer from '../components/CustomDrawer';

import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MomentsScreen from '../screens/MomentsScreen';
import SettingsScreen from '../screens/SettingsScreen';

import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const AuthStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#aa18ea',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
          marginLeft: -25,
          fontSize: 15,
        },
      }}>
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({color}) => (null
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({color}) => (null
          ),
        }}
      />
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          drawerIcon: ({color}) => (null
          ),
        }}
      />
      <Drawer.Screen
        name="Moments"
        component={MomentsScreen}
        options={{
          drawerIcon: ({color}) => (null
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({color}) => (null
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default AuthStack;