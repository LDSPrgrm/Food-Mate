import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
  }));
  const [birthdateLabel, setBirthdateLabel] = useState('Birthdate');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [sex, setSex] = useState('');
  const [civilStatus, setCivilStatus] = useState('');
  const [email, setEmail] = useState('');

  function handleOnPress() {
    setOpen(!open);
  }

  const handleRegister = async () => {
    if(password === confirmPassword) {
      try {
        const response = await axios.post(
          'http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/insert_user.php',
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
          { headers: { 'Content-Type': 'application/json' } }
        );

        (response.data.success) ? navigation.navigate('Login') : Alert.alert('Registration Failed', 'Invalid credentials. Please check personal details.');

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
        </View>

        <Text
          style={{
            fontSize: 28,
            fontWeight: '500',
            color: '#333',
            marginBottom: 30,
          }}>
          Register
        </Text>

        <InputField
          label={'First Name'}
          keyboardType="default"
          onInputChange={(text) => setFirstName(text)}
        />

        <InputField
          label={'Middle Name'}
          keyboardType="default"
          onInputChange={(text) => setMiddleName(text)}
        />

        <InputField
          label={'Last Name'}
          keyboardType="default"
          onInputChange={(text) => setLastName(text)}
        />

        <InputField
          label={'Sex'}
          keyboardType="default"
          onInputChange={(text) => setSex(text)}
        />

        <InputField
          label={'Civil Status'}
          keyboardType="default"
          onInputChange={(text) => setCivilStatus(text)}
        />

        <InputField
          label={'Email'}
          keyboardType="default"
          onInputChange={(text) => setEmail(text)}
        />

        <InputField
          label={'Username'}
          keyboardType="default"
          onInputChange={(text) => setUsername(text)}
        />

        <InputField
          label={'Password'}
          inputType="password"
          onInputChange={(text) => setPassword(text)}
        />

        <InputField
          label={'Confirm Password'}
          inputType="password"
          onInputChange={(text) => setConfirmPassword(text)}
        />

        <View
          style={{
            flexDirection: 'row',
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
            paddingBottom: 8,
            marginBottom: 30,
          }}>
          <TouchableOpacity onPress={handleOnPress}>
            <Text style={{color: '#666', marginLeft: 5, marginTop: 5}}>
              {birthdateLabel}
            </Text>
          </TouchableOpacity>
        </View>

        <DatePicker
          mode='calendar'
          minimumDate='1970-01-01'
          maximumDate='2024-01-01'
          onSelectedChange={birthdate => {
            setOpen(false);
            setBirthdate(birthdate);
            setBirthdateLabel(birthdate);
          }}
        />

        <CustomButton label={'Register'} onPress={(handleRegister)} />

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
          <Text>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{color: '#AD40AF', fontWeight: '700'}}>Login here</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;