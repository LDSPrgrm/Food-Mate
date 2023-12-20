// PaymentModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const PaymentModal = ({ userInfo, isVisible, onSuccess, onClose, totalAmount, balance }) => {

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.heading}>Payment Confirmation</Text>
          <View style={styles.amountContainer}>
            <View style={styles.amountTextContainer}>
              <Text style={styles.amountLabelText}>Total Amount:</Text>
            </View>
            <View style={styles.amountValueContainer}>
              <Text style={styles.amountText}>₱ {totalAmount.toFixed(2)}</Text>
            </View>
          </View>
          <View style={styles.amountContainer}>
            <View style={styles.amountTextContainer}>
              <Text style={styles.amountLabelText}>Balance:</Text>
            </View>
            <View style={styles.amountValueContainer}>
              <Text style={styles.amountText}>₱ {balance}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSuccess} style={styles.payButton}>
              <Text style={styles.buttonText}>Pay</Text>
            </TouchableOpacity>
          </View>
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
    width: 320,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 10,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  amountTextContainer: {
    flex: 1,
  },
  amountLabelText: {
    fontSize: 17,
    alignSelf: 'flex-start',
  },
  amountValueContainer: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  amountText: {
    fontSize: 17,
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payButton: {
    backgroundColor: '#3EB075',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginLeft: 5,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginRight: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default PaymentModal;
