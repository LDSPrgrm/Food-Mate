import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

const LoginScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        'http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/get_users.php',
        { 
          username: username,
          password: password,
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.role_id === 2) {
        // User exists, navigate to the next screen or perform other actions
        // You might want to store the user data in a global state or context
        user = response.data;
        const title = user.sex === "M" ? "Sir" : "Ma'am";
        console.log('Hello ', title, user.first_name, ' ', user.last_name, '!');
        navigation.navigate('Onboarding');
      } else {
        // User doesn't exist or credentials are incorrect
        Alert.alert('Login Failed', 'Invalid credentials. Please check your username or password.');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'An error occurred during login.');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <View style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Login
        </Text>

        <InputField
          label={'Username'}
          keyboardType="default"
          onInputChange={(text) => setUsername(text)}
        />

        <InputField
          label={'Password'}
          inputType="password"
          fieldButtonLabel={"Forgot Password?"}
          fieldButtonFunction={() => {}}
          onInputChange={(text) => setPassword(text)}
        />
        
        <CustomButton label={"Login"} onPress={(handleLogin)} />

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
          or
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderColor: '#ddd',
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 30,
              paddingVertical: 10,
            }}>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text>Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;