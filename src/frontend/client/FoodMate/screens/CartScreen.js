// screens/CartScreen.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CartItem from '../components/CartItem';

const CartScreen = ({ route }) => {
  const cartItems = route.params?.cartItems || [];

  return (
    <ScrollView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {cartItems.map((item, index) => (
          <CartItem key={index} product={item} />
        ))}
      </View>
    </ScrollView>
  );
};

export default CartScreen;
