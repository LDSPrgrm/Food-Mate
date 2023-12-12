import React, { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { getTransactionCount } from '../data/GetTransactions';

import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import FoodDetailsScreen from '../screens/FoodDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
        options={({route}) => ({
          title: route.params?.title,
          headerTitleAlign:'center',
        })}
      />
    </Stack.Navigator>
  );
};

const TabNavigator = () => {
  const [transactionCount, setTransactionCount] = useState(0);

  const fetchTransactionCount = async () => {
    try {
      const response = await getTransactionCount();
      setTransactionCount(response);
    } catch (error) {
      console.error('Error fetching transaction count:', error);
    }
  };

  useEffect(() => {
    fetchTransactionCount();
    const intervalId = setInterval(fetchTransactionCount, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {backgroundColor: '#3EB075'},
        tabBarInactiveTintColor: '#fff',
        tabBarActiveTintColor: 'yellow',
      }}>
      <Tab.Screen
        name="Home2"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#3EB075',
          },
          tabBarBadgeStyle: { backgroundColor: 'yellow' },
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        })}
      />

      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#3EB075',
          },
          tabBarBadgeStyle: { backgroundColor: 'yellow' },
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/order.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        })}
      />
      
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={({route}) => ({
          tabBarStyle: {
            display: getTabBarVisibility(route),
            backgroundColor: '#3EB075',
          },
          tabBarBadge: transactionCount,
          tabBarBadgeStyle: { backgroundColor: 'yellow' },
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../assets/images/misc/cart.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        })}
      />
    </Tab.Navigator>
  );
};

const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  if (routeName === 'FoodDetails') {
    return 'none';
  }
  return 'flex';
};

export default TabNavigator;