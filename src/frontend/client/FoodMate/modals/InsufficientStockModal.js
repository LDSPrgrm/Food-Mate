// InsufficientStockModal.js
import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const InsufficientStockModal = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.errorText}>
            Insufficient Stock!
          </Text>
          <Text style={{
            textAlign: 'center',
            fontSize: 18,
          }}>Sorry, some of the selected items are out of stock.
          </Text>
          <Text style={{
            textAlign: 'center',
            fontSize: 17,
            marginBottom: 15,
          }}>Please adjust your order quantity or choose other items.
          </Text>
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
  errorText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: 'red',
  },
  closeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default InsufficientStockModal;
