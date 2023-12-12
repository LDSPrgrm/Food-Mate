import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';

export default function InputField({
  label,
  icon,
  inputType,
  keyboardType,
  onInputChange,
}) {
  const [text, setText] = useState('');

  const handleChangeText = (inputText) => {
    setText(inputText);
    onInputChange(inputText);
  };

  const icons = {
    usernameIcon: require('../assets/images/misc/username.png'),
    passwordIcon: require('../assets/images/misc/password.png'),
    emailIcon: require('../assets/images/misc/email.png'),
  };

  return (
    <View style={{ marginTop: 30 }}>
      <View
        style={{
          flexDirection: 'row',
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
          alignItems: 'center',
        }}>
        {icon && (
          <Image
            source={icons[icon]}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
        )}
        {inputType === 'password' ? (
          <TextInput
            placeholder={label}
            keyboardType={keyboardType}
            style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
            secureTextEntry={true}
            onChangeText={handleChangeText}
            value={text}
          />
        ) : (
          <TextInput
            placeholder={label}
            keyboardType={keyboardType}
            style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
            onChangeText={handleChangeText}
            value={text}
          />
        )}
      </View>
    </View>
  );
}
