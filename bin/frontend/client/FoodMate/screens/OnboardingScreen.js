import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OnboardingScreen = ({ navigation }) => {
  // Animation for the logo
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo animation
    Animated.spring(logoScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    // Fade-in animation for text
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
      easing: Easing.ease,
    }).start();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFCFE',
        paddingHorizontal: 20,
      }}
    >
      <Animated.View
        style={{
          marginVertical: 100,
          width: 300,
          alignItems: 'center',
          opacity: fadeIn,
        }}
      >
        <Animated.Image
          source={require('../assets/images/misc/logo.png')}
          style={{
            width: 250,
            height: 250,
            resizeMode: 'contain',
            transform: [{ scale: logoScale }],
            marginBottom: 30,
          }}
        />
        <Animated.Text
          style={{
            fontWeight: 'bold',
            fontSize: 40,
            textAlign: 'center',
            textShadowColor: 'rgba(0, 0, 0, 0.2)',
            textShadowOffset: { width: 1, height: 1 },
            textShadowRadius: 5,
            opacity: fadeIn,
          }}
        >
          Welcome to Food Mate
        </Animated.Text>
        <Animated.Text
          style={{
            color: '#555',
            fontSize: 17,
            textAlign: 'center',
            marginTop: 10,
            width: 300,
            opacity: fadeIn,
          }}
        >
          Satisfy your cravings with the best food options around you.
        </Animated.Text>
      </Animated.View>

      <TouchableOpacity
        style={{
          backgroundColor: '#3EB075',
          padding: 20,
          width: '90%',
          borderRadius: 10,
          marginBottom: 50,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => navigation.navigate('Login')}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Let's Begin!
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
