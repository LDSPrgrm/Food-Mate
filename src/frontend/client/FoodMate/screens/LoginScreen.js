import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../components/CustomButton';
import InputField from '../components/InputField';

import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({navigation}) => {
  const {login} = useContext(AuthContext);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 25 }}>
        <Image
          source={require('../assets/images/misc/logo.png')}
          style={{ width: 125, height: 125, alignSelf: 'center', marginBottom: 20 }}
        />

        <Text
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: '#0A0A0F',
            alignSelf: 'center',
          }}>
          Login to Food Mate
        </Text>

        <InputField
          icon='usernameIcon'
          label={'Username'}
          keyboardType="default"
          onInputChange={(text) => setUsername(text)}
        />

        <InputField
          icon='passwordIcon'
          label={'Password'}
          inputType="password"
          fieldButtonFunction={() => {}}
          onInputChange={(text) => setPassword(text)}
        />
        
      <TouchableOpacity onPress={(null)}>
        <Text style={{ color: '#3EB075', fontWeight: '700', marginTop: 10, marginBottom: 0, alignSelf: 'flex-end', fontSize: 17 }}>
          Forgot Password?
        </Text>
      </TouchableOpacity>
        
        <CustomButton label={"Login"} onPress={() => {login(username, password)}} />

        <Text style={{textAlign: 'center', color: '#666', marginVertical: 10}}>
          or
        </Text>

        <View
          style={{
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 7,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/misc/fb.png')}
              style={{ width: 40, height: 40, borderRadius: 10}}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={{fontSize: 16, fontWeight: 700}}>Continue with Facebook</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 7,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/misc/google.png')}
              style={{ width: 40, height: 40, borderRadius: 10}}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={{fontSize: 16, fontWeight: 700}}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {}}
            style={{
              borderWidth: 1,
              borderRadius: 10,
              paddingHorizontal: 15,
              paddingVertical: 7,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/misc/apple.png')}
              style={{ width: 40, height: 40, borderRadius: 10}}
            />
            <View style={{ flex: 1, alignItems: 'center', }}>
              <Text style={{fontSize: 16, fontWeight: 700}}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
          }}>
          <Text style={{fontSize: 17}}>Don't have an account yet? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{color: '#3EB075', fontWeight: '700', fontSize: 17}}>Register here</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;