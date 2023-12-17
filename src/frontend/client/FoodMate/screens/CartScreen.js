import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import CartItem from '../components/CartItem';
import { getCartCount, getCartDetails, deleteFromCart } from '../data/Cart.js';
import { AuthContext } from '../context/AuthContext';
import PaymentModal from '../modals/PaymentModal.js';
import TransactionSuccessModal from '../modals/TransactionSuccessModal.js';
import InsufficientStockModal from '../modals/InsufficientStockModal.js';
import { addOrder } from '../data/AddOrder.js';
import { deductPayment } from '../data/AddOrder.js';

const CartScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartDetails, setCartDetails] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [insufficientStockModalVisible, setInsufficientStockModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleCheckboxToggle = (productId) => {
    if (checkedItems.includes(productId)) {
      setCheckedItems(checkedItems.filter((id) => id !== productId));
    } else {
      setCheckedItems([...checkedItems, productId]);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartDetails();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchCartCount();
    fetchCartDetails();
    setIsRefreshing(false);
  }, []);

  const fetchCartCount = async () => {
    try {
      const count = await getCartCount(userInfo.username);
      setCartCount(count);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchCartDetails = async () => {
    try {
      const details = await getCartDetails(userInfo.user_id);
      Array.isArray(details) ? setCartDetails(details) : console.error('Error: Cart details is not an array');
    } catch (error) {
      console.error('Error fetching cart details:', error);
    }
  };

  const calculateSubtotal = () => {
    let subtotal = 0;

    for (const item of cartDetails) {
      if (checkedItems.includes(item.product_id)) {
        subtotal += parseFloat(item.subtotal);
      }
    }

    return subtotal.toFixed(2);
  };

  const handleCheckout = () => {
    const itemsToCheckout = cartDetails.filter(item => checkedItems.includes(item.product_id));
    setSelectedItems(itemsToCheckout);
    const totalAmount = parseFloat(calculateSubtotal());
    setTotalAmount(totalAmount);

    if (userInfo && userInfo.user_id) {
      setPaymentModalVisible(true);
    } else {
      console.error('User information not available.');
    }
  };

  const processPayment = async (selectedItems) => {
    setPaymentModalVisible(false);
  
    const orderPromises = selectedItems.map(async item => {
      return await addOrder(userInfo.user_id, item.product_id, item.quantity);
    });
  
    const results = await Promise.all(orderPromises);
    const hasInsufficientStock = results.some(success => !success);
  
    if (hasInsufficientStock) {
      setInsufficientStockModalVisible(true);
      return;
    }
  
    await deductPayment(userInfo.user_id, totalAmount);
    setSuccessModalVisible(true);
  };  

  const deleteCartItem = async (productId) => {
    try {
      deleteFromCart(userInfo.user_id, productId);
      onRefresh();
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#333' }}>Your Cart</Text>
      </View>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
        style={{ flex: 1, paddingHorizontal: 16 }}
      >
        {Array.isArray(cartDetails) && cartDetails.length > 0 ? (
          cartDetails.map((item, index) => (
            <CartItem
              key={index}
              product={item}
              onDelete={deleteCartItem}
              isCheck={checkedItems.includes(item.product_id)}
              onToggleCheckbox={() => handleCheckboxToggle(item.product_id)}
              onQuantityChange={fetchCartDetails}
            />
          ))
        ) : (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 18, color: '#555' }}>Your cart is empty</Text>
          </View>
        )}
      </ScrollView>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}>Total: ₱ {calculateSubtotal()}</Text>
        <TouchableOpacity
          style={{
            backgroundColor: checkedItems.length === 0 ? '#ddd' : '#3EB075',
            paddingVertical: 15,
            paddingHorizontal: 30,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={handleCheckout}
          disabled={checkedItems.length === 0}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Checkout</Text>
        </TouchableOpacity>
      </View>

      <PaymentModal
        userInfo={userInfo.user_id}
        isVisible={isPaymentModalVisible}
        onSuccess={() => processPayment(selectedItems)}
        onClose={() => setPaymentModalVisible(false)}
        totalAmount={totalAmount}
        balance={userInfo.balance}
      />

      <TransactionSuccessModal
        isVisible={isSuccessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
      />

      <InsufficientStockModal
        isVisible={insufficientStockModalVisible}
        onClose={() => setInsufficientStockModalVisible(false)}
      />
    </View>
  );
};

export default CartScreen;
