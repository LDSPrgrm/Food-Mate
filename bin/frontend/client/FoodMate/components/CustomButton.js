import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

export default function CustomButton({label, onPress}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: '#3EB075',
        padding: 20,
        borderRadius: 10,
        marginTop: 25,
      }}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: '700',
          fontSize: 20,
          color: '#fff',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}