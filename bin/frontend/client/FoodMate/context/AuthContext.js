import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useState, useEffect} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [userToken, setUserToken] = useState(null);
    const [balance, setBalance] = useState(0);

    const login = (username, password) => {
        setIsLoading(true);

        axios.post(
            'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/get_users.php',
            { 
              username: username,
              password: password
            },
            { 
                headers: { 'Content-Type': 'application/json' } 
            })
          .then(response => {
            let userInfo = response.data;
            if (userInfo && userInfo.role_id === 2) {
                
                setUserInfo(userInfo);
                setUserToken(userInfo.username);

                AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
                AsyncStorage.setItem('userToken', userInfo.username);
            } else {
                Alert.alert('Login Failed', 'Invalid credentials. Please check your username or password.');
            }
          })
          .catch(e => {
            Alert.alert('Login Failed', 'An error occurred during login.');
          });

        setIsLoading(false);
    }

    const logout = () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);

        AsyncStorage.removeItem('userInfo');
        AsyncStorage.removeItem('userToken');

        setIsLoading(false);
    }

    const isLoggedIn = async() => {
        try {
            setIsLoading(true);

            let userInfo = JSON.parse(await AsyncStorage.getItem('userInfo'));
            let userToken = await AsyncStorage.getItem('userToken');

            if(userInfo) {
                setUserToken(userInfo);
                setUserToken(userToken);
            }
            setIsLoading(false);
        } catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        isLoggedIn();
    }, []);

    const updateBalance = (newBalance) => {
        setBalance(newBalance);
      };

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo, balance, updateBalance}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useBalance = () => {
    const { balance, updateBalance } = useContext(AuthContext);
  
    if (updateBalance === undefined) {
      throw new Error("useBalance must be used within an AuthProvider");
    }
  
    return { balance, updateBalance };
  };