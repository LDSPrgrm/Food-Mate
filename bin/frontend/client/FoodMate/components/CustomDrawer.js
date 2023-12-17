import React, { useContext, useState } from 'react';
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

import { AuthContext, useBalance } from '../context/AuthContext';
import RechargeModal from '../modals/RechargeModal';
import { recharge } from '../data/Cart';

const CustomDrawer = props => {
  const {logout} = useContext(AuthContext);
  const {userInfo} = useContext(AuthContext);
  const [isRechargeModalVisible, setRechargeModalVisible] = useState(false);
  const { balance, updateBalance } = useBalance();

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

  const handleRechargePress = () => {
    setRechargeModalVisible(true);
  };

  const handleRechargeConfirm = async (amount) => {
    try {
      const updatedBalance = await recharge(userInfo.user_id, amount);
      updateBalance(updatedBalance.balance);
  
      Alert.alert(
        'Recharge Successful',
        `Successfully added ₱ ${amount} to your balance.`,
        [
          {
            text: 'OK',
            onPress: () => setRechargeModalVisible(false),
          },
        ]
      );
    } catch (error) {
      console.error('Error during recharge:', error);
    }
  };
  

  const handleRechargeCancel = () => {
    setRechargeModalVisible(false);
  };
  
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{backgroundColor: '#3EB075'}}>
        <ImageBackground
          source={require('../assets/images/misc/cart_selected.png')}
          style={{padding: 20}}>
          <Image
            source={require('../assets/images/misc/username.png')}
            style={{height: 80, width: 80, borderRadius: 40, marginBottom: 10}}
          />
          <Text
            style={{
              color: '#fff',
              fontSize: 18,
              marginBottom: 5,
            }}>
            {/* {userInfo.username} */}
          </Text>
          <View style={{flexDirection: 'row', 
            alignItems: 'center', 
            justifyContent: 'space-between'}}>
            <Text
              style={{
                color: '#fff',
                fontSize: 18,
                marginRight: 5,
              }}>
              ₱ {balance}
            </Text>
            <TouchableOpacity onPress={handleRechargePress} style={{
              backgroundColor: '#3EB075',
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
              alignItems: 'center',
              borderColor: 'white',
              borderWidth: 1,
            }}>
              <Text style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
              }}>Recharge</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <RechargeModal
        isVisible={isRechargeModalVisible}
        onConfirm={handleRechargeConfirm}
        onCancel={handleRechargeCancel}
      />

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