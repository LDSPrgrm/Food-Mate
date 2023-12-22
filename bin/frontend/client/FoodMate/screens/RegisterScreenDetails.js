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

const RegisterScreenDetails = ({navigation}) => {
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
          'http://192.168.108.88/Projects/E-Commerce/src/backend/api/php/client/insert_user.php',
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
            fontSize: 30,
            fontWeight: '500',
            color: '#0A0A0F',
            marginVertical: 30,
            alignSelf: 'center'
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
            <Text style={{color: '#0A0A0F', paddingVertical: 0, fontSize: 16}}>
              {birthdateLabel}
            </Text>
          </TouchableOpacity>
        </View>
        {open && (
          <DatePicker
            mode='calendar'
            minimumDate='1970-01-01'
            maximumDate='2024-01-01'
            onSelectedChange={(birthdate) => {
              setOpen(false);
              setBirthdate(birthdate);
              setBirthdateLabel(birthdate);
            }}
            
            style={{ marginBottom: 20 }}
            textColor="#0A0A0F"
            selectedTextColor="#fff"
            backgroundColor="#fff"
            selectedBackgroundColor="#3EB075"
            borderColor="#3EB075"
            borderRadius={10}
          />
        )}
        <CustomButton label={'Register'} onPress={(handleRegister)} />

        <Text style={{textAlign: 'center', color: '#666', marginBottom: 30}}>
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
              <Text style={{fontSize: 16}}>Continue with Facebook</Text>
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
              <Text style={{fontSize: 16}}>Continue with Google</Text>
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
              <Text style={{fontSize: 16}}>Continue with Apple</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 30,
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

export default RegisterScreenDetails;