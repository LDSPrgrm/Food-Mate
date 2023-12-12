import React, { useContext } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import { AuthContext } from '../context/AuthContext';

const CustomDrawer = props => {
  const {logout} = useContext(AuthContext);
  
  const handleLogoutPress = (logout) => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => logout(),
          style: 'destructive',
          color: 'red',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#3EB075'}}>
        {/* <ImageBackground
          source={require('../assets/images/menu-bg.jpeg')}
          style={{padding: 20}}>
          <Image
            source={require('../assets/images/user-profile.jpg')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              marginBottom: 5,
            }}>
            John Doe
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#fff',
                marginRight: 5,
              }}>
              280 Coins
            </Text>
          </View>
        </ImageBackground> */}
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#ccc'}}>
        <TouchableOpacity onPress={() => {handleLogoutPress(logout)}} style={{paddingVertical: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center', color: 'red'}}>
            <Image
              source={require('../assets/images/misc/logout.png')}
              style={{ width: 40, height: 40, borderRadius: 10}}
            />
            <Text
              style={{
                fontSize: 17,
                marginLeft: 10,
                color: 'red',
                fontWeight: 700,
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default CustomDrawer;