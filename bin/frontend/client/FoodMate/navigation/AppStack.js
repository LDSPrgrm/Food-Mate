import React from 'react';
import { Image } from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';

import CustomDrawer from '../components/CustomDrawer';
import ProfileScreen from '../screens/ProfileScreen';
import MessagesScreen from '../screens/MessagesScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import SettingsScreen from '../screens/SettingsScreen';

import TabNavigator from './TabNavigator';

const Drawer = createDrawerNavigator();

const AppStack = () => {

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#3EB075',
        drawerActiveTintColor: '#fff',
        drawerInactiveTintColor: '#0A0A0F',
        drawerLabelStyle: {
          marginLeft: 25,
          fontSize: 15,
        },
      }}>
        
      <Drawer.Screen
        name="Home"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          drawerLabel: 'Home',
          drawerLabelStyle: {
            marginLeft: -10,
          },
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/profile.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          drawerLabel: 'Profile',
          drawerLabelStyle: {
            marginLeft: -10,
          },
        }}
      />

      <Drawer.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/favorite.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          drawerLabel: 'Favorites',
          drawerLabelStyle: {
            marginLeft: -10,
          },
        }}
      />
      
      <Drawer.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/messages.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          drawerLabel: 'Messages',
          drawerLabelStyle: {
            marginLeft: -10,
          },
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/settings.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          drawerLabel: 'Settings',
          drawerLabelStyle: {
            marginLeft: -10,
          },
        }}
      />
    </Drawer.Navigator>
  );
};

export default AppStack;