import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { AuthContext } from '../context/AuthContext';

const CartItem = ({ product, onDelete, isCheck, onToggleCheckbox }) => {
  const [subtotal, setSubtotal] = useState(parseFloat(product.subtotal));
  const [quantity, setQuantity] = useState(Number(product.quantity));
  const {userInfo} = useContext(AuthContext);

  const toggleCheckbox = () => {
    onToggleCheckbox();
  };

  useEffect(() => {
    if (product.subtotal !== undefined) {
      const parsedSubtotal = parseFloat(product.subtotal);
      if (!isNaN(parsedSubtotal)) {
        setSubtotal(parsedSubtotal);
      }
    }
  }, [product]);

  useEffect(() => {
    setQuantity(product.quantity);
  }, [product]);

  function updateSubtotal(newQuantity) {
    if (!isNaN(product.price)) {
      const newSubtotal = parseFloat((newQuantity * product.price).toFixed(2));
      setSubtotal(newSubtotal);
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateSubtotal(subtotal);
    } else {
      Alert.alert(
        'Remove Product',
        'Do you want to remove this product from your cart?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            onPress: () => {
              onDelete(product.product_id);
              console.log('Product removed from cart');
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const incrementQuantity = () => {
    if (quantity < 99) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      updateSubtotal(newQuantity);
    }
  };

  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      padding: 10 }}
      >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <CheckBox
        title=""
        checked={isCheck}
        onPress={toggleCheckbox}
        containerStyle={{ margin: 0, padding: 0 }}
      />
        <View style={{ marginLeft: 10, alignItems: 'center', }}>
          <Text>Product ID: {product.product_id}</Text>
          <Text>Price: {product.price}</Text>

          <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={decrementQuantity}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  marginRight: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color: '#fff',
                  }}
                >
                  -
                </Text>
              </View>
            </TouchableOpacity>

            <View style={{ width: 'auto', justifyContent: 'center', alignItems: 'center' }}>
              <Text>Quantity: {quantity}</Text>
            </View>

            <TouchableOpacity onPress={incrementQuantity} disabled={quantity === 99}>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: quantity < 99 ? '#3EB075' : 'gray',
                  borderRadius: 50,
                  width: 40,
                  height: 40,
                  marginLeft: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 30,
                    color: '#fff',
                  }}
                >
                  +
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default CartItem;
