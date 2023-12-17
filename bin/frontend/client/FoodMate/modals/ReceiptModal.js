// ReceiptModal.js
import React from 'react';
import { View, Text, Modal, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const ReceiptModal = ({ isVisible, onClose, cartDetails, totalAmount, payment, changeAmount }) => {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>Product ID: {item.product_id}</Text>
      <Text>Quantity: {item.quantity}</Text>
      <Text>Price: ₱ {item.price}</Text>
      <Text>Subtotal: ₱ {(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Receipt</Text>
          <FlatList
            data={cartDetails}
            renderItem={renderItem}
            keyExtractor={(item) => item.product_id.toString()}
          />
          <Text style={styles.total}>Total Amount: ₱ {totalAmount}</Text>
          <Text style={styles.total}>Payment: ₱ {payment}</Text>
          <Text style={styles.total}>Change: ₱ {changeAmount}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    marginBottom: 10,
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  closeButton: {
    backgroundColor: '#3EB075',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReceiptModal;
