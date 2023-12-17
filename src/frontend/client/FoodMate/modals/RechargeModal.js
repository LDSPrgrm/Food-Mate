// RechargeModal.js
import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const RechargeModal = ({ isVisible, onConfirm, onCancel }) => {
  const [rechargeAmount, setRechargeAmount] = useState('');

  const handleConfirm = () => {
    onConfirm(rechargeAmount);
    setRechargeAmount('');
  };

  const handleCancel = () => {
    onCancel();
    setRechargeAmount('');
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.titleText}>Enter Recharge Amount:</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={rechargeAmount}
            onChangeText={(text) => setRechargeAmount(text)}
          />
          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={handleCancel} color="red" />
            <Button title="Confirm" onPress={handleConfirm} color="#3EB075" />
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
    width: 300,
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default RechargeModal;
