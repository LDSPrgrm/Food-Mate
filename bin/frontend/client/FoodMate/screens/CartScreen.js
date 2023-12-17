import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import CartItem from '../components/CartItem';
import { getCartCount, getCartDetails, deleteFromCart } from '../data/Cart.js';
import { AuthContext, useBalance } from '../context/AuthContext';
import PaymentModal from '../modals/PaymentModal.js';
import TransactionSuccessModal from '../modals/TransactionSuccessModal.js';
import { addOrder } from '../data/AddOrder.js';
import { deductPayment } from '../data/AddOrder.js';

const CartScreen = () => {
  const [cartCount, setCartCount] = useState(0);
  const [cartDetails, setCartDetails] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const {userInfo} = useContext(AuthContext);
  const [checkedItems, setCheckedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const { balance, updateBalance } = useBalance();

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
      const details = await getCartDetails(userInfo.username);
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
  
  const handleBalanceUpdate = async () => {
    const balance = await deductPayment(userInfo.user_id, totalAmount);
    console.log(balance.data.balance);
    updateBalance(balance.data.balance);
  }

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
    selectedItems.forEach(item => {
      addOrder(userInfo.user_id, item.product_id, item.quantity, totalAmount);
    });
    handleBalanceUpdate();
    setSuccessModalVisible(true);
  };

  const deleteCartItem = async (productId) => {
    try {
      await deleteFromCart(userInfo.user_id, productId);
      console.log('Product removed from cart');
      // Call the function to refresh the cart details
      onRefresh();
    } catch (error) {
      console.error('Error deleting product from cart:', error);
    }
  };

  return (
    <View style={{
      flex: 1, 
      paddingBottom: 65,
    }}>
      <View>
        <Text style={{
          alignSelf: 'center',
          fontSize: 25,
          fontWeight: 700,
          marginTop: 10
        }}>
          Cart
        </Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {Array.isArray(cartDetails) && cartDetails.length > 0 ? (
            cartDetails.map((item, index) => (
              <View key={index}>
                <CartItem
                  product={item}
                  onDelete={deleteCartItem}
                  isCheck={checkedItems.includes(item.product_id)}
                  onToggleCheckbox={() => handleCheckboxToggle(item.product_id)}
                />
                <Text> </Text>
              </View>
            ))
          ) : (
            <Text>No items in the cart</Text>
          )}
        </View>
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
      }}>
        <Text style={{ fontSize: 17 }}>Total Amount: ₱ {calculateSubtotal()}</Text>

        <TouchableOpacity
          style={{
            backgroundColor: '#3EB075',
            padding: 15,
            alignItems: 'center',
            borderRadius: 5,
          }}
          onPress={handleCheckout}
        >
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 17 }}>Checkout</Text>
        </TouchableOpacity>
      </View>
      
      <PaymentModal 
        userInfo={userInfo.user_id}
        isVisible={isPaymentModalVisible}
        onSuccess={() => processPayment(selectedItems)}
        onClose={() => setPaymentModalVisible(false)} 
        totalAmount={totalAmount.toFixed(2)}
        balance={userInfo.balance}
        onBalanceUpdate={handleBalanceUpdate}
        />

      <TransactionSuccessModal
        isVisible={isSuccessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
      />

    </View>
  );
};

export default CartScreen;
