import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';
import BannerSlider from '../components/BannerSlider';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';
import { windowWidth } from '../utils/Dimensions';
import { AuthContext } from '../context/AuthContext';
import { sliderData, getAvailableProductData, getUnavailableProductData } from '../data/products.js';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [productsTab, setproductsTab] = useState(1);
  const [availableViands, setAvailableViands] = useState([]);
  const [unavailableViands, setUnavailableViands] = useState([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
  const [isLoadingUnavailable, setIsLoadingUnavailable] = useState(true);

  const renderBanner = ({ item, index }) => {
    return <BannerSlider data={item} />;
  };

  const onSelectSwitch = value => {
    setproductsTab(value);
  };

  const fetchData = async () => {
    try {
      const [available, unavailable] = await Promise.all([
        getAvailableProductData(),
        getUnavailableProductData(),
      ]);

      setAvailableViands(available);
      setUnavailableViands(unavailable);
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoadingAvailable(false);
      setIsLoadingUnavailable(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ paddingHorizontal: 20, paddingTop: 0 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 20,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require('../assets/images/misc/username.png')}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <ImageBackground
              source={require('../assets/images/misc/favorite.png')}
              style={{ width: 35, height: 35 }}
              imageStyle={{ borderRadius: 25 }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            borderColor: '#C6C6C6',
            borderWidth: 1,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 8,
          }}>
          <TextInput placeholder="Search" />
        </View>

        <View
          style={{
            marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{ fontSize: 17, fontWeight: 700 }}>
            Upcoming Viands
          </Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ color: '#0aada8', fontSize: 17, fontWeight: 700 }}>See all</Text>
          </TouchableOpacity>
        </View>

        <Carousel
          ref={c => {
            this._carousel = c;
          }}
          data={sliderData}
          renderItem={renderBanner}
          sliderWidth={windowWidth - 40}
          itemWidth={300}
          loop={true}
        />

        <View style={{ marginVertical: 20 }}>
          <CustomSwitch
            selectionMode={1}
            option1="Popular"
            option2="Free Delivery"
            onSelectSwitch={onSelectSwitch}
          />
        </View>

        {productsTab === 1 &&
          (isLoadingAvailable ? (
            <ActivityIndicator size='large' />
          ) : (
            availableViands.map(item => (
              <ListItem
                key={item.id}
                title={item.name}
                subTitle={item.description}
                isAvailable={item.isAvailable}
                price={item.price}
                onPress={() =>
                  navigation.navigate('FoodDetails', {
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock,
                    status_id: item.status_id,
                    type_id: item.type_id,
                  })
                }
              />
            ))
          ))}
        {productsTab === 2 &&
          (isLoadingUnavailable ? (
            <ActivityIndicator size='large' />
          ) : (
            unavailableViands.map(item => (
              <ListItem
                key={item.id}
                title={item.name}
                subTitle={item.description}
                isAvailable={item.isAvailable}
                price={item.price}
                onPress={() =>
                  navigation.navigate('FoodDetails', {
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock,
                    status_id: item.status_id,
                    type_id: item.type_id,
                  })
                }
              />
            ))
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;