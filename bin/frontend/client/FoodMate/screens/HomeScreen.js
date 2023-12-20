import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';
import BannerSlider from '../components/BannerSlider';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';
import { windowWidth } from '../utils/Dimensions';
import { AuthContext } from '../context/AuthContext';
import { sliderData, getAvailableProductData, getUnavailableProductData } from '../data/Products.js';
import { slidersData } from '../data/data.js';

const HomeScreen = ({ navigation }) => {
  const { userInfo } = useContext(AuthContext);
  const [productsTab, setproductsTab] = useState(1);
  const [availableViands, setAvailableViands] = useState([]);
  const [unavailableViands, setUnavailableViands] = useState([]);
  const [isLoadingAvailable, setIsLoadingAvailable] = useState(true);
  const [isLoadingUnavailable, setIsLoadingUnavailable] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAvailableViands, setFilteredAvailableViands] = useState([]);
  const [filteredUnavailableViands, setFilteredUnavailableViands] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const handleSearch = (text) => {
    setSearchTerm(text);
  
    const filterProducts = (products) =>
      products.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.description.toLowerCase().includes(text.toLowerCase())
      );
  
    if (text.trim() === '') {
      // If there is no search term, show all products
      setFilteredAvailableViands(availableViands);
      setFilteredUnavailableViands(unavailableViands);
    } else {
      // If there is a search term, filter the products
      setFilteredAvailableViands(filterProducts(availableViands));
      setFilteredUnavailableViands(filterProducts(unavailableViands));
    }
  };

  const renderBanner = ({ item, index }) => {
    return <BannerSlider data={item} />;
  };

  const onSelectSwitch = async value => {
    setproductsTab(value);
  };

  const fetchData = async () => {
    try {
      // Set refreshing to true when starting to fetch data
      setRefreshing(true);

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

      // Set refreshing to false when data fetching is complete
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  useEffect(() => {
    setFilteredAvailableViands(availableViands);
    setFilteredUnavailableViands(unavailableViands);
  }, [availableViands, unavailableViands]);
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
       <ScrollView
        style={{ paddingHorizontal: 20, paddingTop: 0 }}
        refreshControl={  // Add RefreshControl here
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchData}  // Call the fetchData function on pull-to-refresh
          />
        }
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            marginBottom: 10,
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <ImageBackground
              source={require('../assets/images/misc/user-profile.jpg')}
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
            marginVertical: 15,
          }}
        >
          <TextInput
            style={{ flex: 1 }}
            placeholder="Search"
            value={searchTerm}
            onChangeText={(text) => handleSearch(text)}
          />
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
          ref={c => { this._carousel = c; }}
          data={slidersData}
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
            <ActivityIndicator size="large" />
          ) : (
            filteredAvailableViands.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                subTitle={item.description}
                isAvailable={item.isAvailable}
                price={item.price}
                stock={item.stock}
                onPress={() =>
                  navigation.navigate('FoodDetails', {
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock,
                    status_id: item.status_id,
                  })
                }
              />
            ))
          ))}
        {productsTab === 2 &&
          (isLoadingUnavailable ? (
            <ActivityIndicator size="large" />
          ) : (
            filteredUnavailableViands.map((item) => (
              <ListItem
                key={item.id}
                title={item.name}
                subTitle={item.description}
                isAvailable={item.isAvailable}
                price={item.price}
                stock={item.stock}
                onPress={() =>
                  navigation.navigate('FoodDetails', {
                    id: item.id,
                    title: item.name,
                    description: item.description,
                    price: item.price,
                    stock: item.stock,
                    status_id: item.status_id,
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