import React, {useState} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

import InputField from '../components/InputField';
import CustomButton from '../components/CustomButton';
import DatePicker from 'react-native-modern-datepicker';

const RegisterScreen = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [birthdate, setBirthdate] = useState(new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).split('/').reverse().join('/'));
  const [birthdateLabel, setBirthdateLabel] = useState('Birthdate');
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [middleName, setMiddleName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [sex, setSex] = useState(null);
  const [civilStatus, setCivilStatus] = useState(null);
  const [email, setEmail] = useState(null);

  function handleOnPress() {
    setOpen(!open);
  }

  const handleRegister = async () => {
    if(password === confirmPassword) {
      try {
        axios.post(
          'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/insert_user.php',
          { 
            username: username,
            password: password,
            first_name: firstName,
            middle_name: middleName,
            last_name: lastName,
            birthdate: birthdate,
            sex: sex,
            civil_status: civilStatus,
            email: email,
          },
          { 
            headers: { 'Content-Type': 'application/json' } 
          })
          .then(response => {
            (response.data.success) ? navigation.navigate('Login') : Alert.alert('Registration Failed', 'Some required inputs are missing. Please check personal details.');
          });
      } catch (error) {
        Alert.alert('Registration Failed', 'An error occurred during registration.');
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{paddingHorizontal: 25}}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('../assets/images/misc/logo.png')}
            style={{ width: 125, height: 125, alignSelf: 'center', marginVertical: 15 }}
          />
        </View>

        <Text
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: '#0A0A0F',
            alignSelf: 'center'
          }}>
          Register to Food Mate
        </Text>

        <InputField
          icon='emailIcon'
          label={'Email'}
          keyboardType="default"
          onInputChange={(text) => setEmail(text)}
        />

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
          onInputChange={(text) => setPassword(text)}
        />

        <InputField
          icon='passwordIcon'
          label={'Confirm Password'}
          inputType="password"
          onInputChange={(text) => setConfirmPassword(text)}
        />

        <CustomButton label={'Register'} onPress={(handleRegister)} />

        <Text style={{textAlign: 'center', color: '#666', marginVertical: 10}}>
          or
        </Text>

        <View
          style={{
            justifyContent: 'space-between',
            marginBottom: 20,
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
          }}>
          <Text style={{fontSize: 17}}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#3EB075', fontWeight: '700', fontSize: 17}}>Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;