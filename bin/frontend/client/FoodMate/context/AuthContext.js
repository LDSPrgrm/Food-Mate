import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useContext, useState, useEffect} from 'react';
import { Alert } from 'react-native';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [userToken, setUserToken] = useState(null);

    const login = (username, password) => {
        setIsLoading(true);

        axios.post(
            'http://192.168.108.88/Projects/E-Commerce/src/backend/api/php/client/get_users.php',
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

    return (
        <AuthContext.Provider value={{login, logout, isLoading, userToken, userInfo}}>
            {children}
        </AuthContext.Provider>
    );
}