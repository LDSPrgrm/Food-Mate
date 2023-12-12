import React from 'react';
import { View, Text } from 'react-native';

const CartItem = ({ product }) => {
  return (
    <View>
      <Text>Product ID: {product.product_id}</Text>
      <Text>Quantity: {product.quantity}</Text>
      <Text>Price: {product.price}</Text>
    </View>
  );
};

export default CartItem;
