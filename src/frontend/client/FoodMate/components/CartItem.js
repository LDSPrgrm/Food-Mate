import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { updateCartDetails } from '../data/Cart';
import { AuthContext } from '../context/AuthContext';

const CartItem = ({ product, onDelete, isCheck, onToggleCheckbox, onQuantityChange }) => {
  const [subtotal, setSubtotal] = useState(parseFloat(product.subtotal));
  const [quantity, setQuantity] = useState(Number(product.quantity));
  const { userInfo } = useContext(AuthContext);

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

  const updateSubtotal = async (newQuantity) => {
    if (!isNaN(product.price)) {
      const newSubtotal = parseFloat((newQuantity * product.price).toFixed(2));
      setSubtotal(newSubtotal);
      await updateCartDetails(userInfo.user_id, product.product_id, newQuantity, newSubtotal);
    }
  }

  useEffect(() => {
    updateSubtotal(quantity);
  }, [quantity]);


  const decrementQuantity = async () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      await updateSubtotal(newQuantity);
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
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const incrementQuantity = async () => {
    if (quantity < 99) {
      const newQuantity = Number(quantity) + 1;
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    updateSubtotal(quantity);
  }, [quantity]);

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 5,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <CheckBox
          title=""
          checked={isCheck}
          onPress={toggleCheckbox}
          containerStyle={{ margin: 0, padding: 0 }}
          checkedIcon="dot-circle-o"
          uncheckedIcon="circle-o"
          checkedColor="#3EB075"
          uncheckedColor="#C41E3A"
          size={50}
        />
        <View style={{ marginLeft: 10, alignItems: 'center', flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{product.name}</Text>
          <View style={styles.productDetailsContainer}>
            <View style={styles.productDetail}>
              <Text style={{ color: '#888' }}>Price: </Text>
              <Text style={{ color: '#333' }}>{product.price}</Text>
            </View>
            <View style={styles.productDetail}>
              <Text style={{ color: '#888' }}>Stock: </Text>
              <Text style={{ color: '#333' }}>{product.stock}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <TouchableOpacity onPress={decrementQuantity}>
              <View style={styles.quantityButton}>
                <Text style={styles.quantityButtonText}>-</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.quantityContainer}>
              <Text style={{ fontSize: 16 }}>Quantity: {quantity}</Text>
            </View>
            <TouchableOpacity onPress={incrementQuantity} disabled={quantity === 99}>
              <View style={[styles.quantityButton, { backgroundColor: quantity < 99 ? '#3EB075' : 'gray' }]}>
                <Text style={styles.quantityButtonText}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  productDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  productDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100
  },
  quantityButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#C41E3A',
    borderRadius: 50,
    width: 50,
    height: 50,
    marginHorizontal: 30,
  },
  quantityButtonText: {
    fontSize: 30,
    color: '#fff',
  },
};

export default CartItem;
