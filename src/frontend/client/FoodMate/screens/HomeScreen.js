import React, { useState, useContext,useEffect } from 'react';
import { 
  View,
  Text,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Carousel from 'react-native-snap-carousel';
import BannerSlider from '../components/BannerSlider';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';
import { windowWidth } from '../utils/Dimensions';
import { AuthContext } from '../context/AuthContext';
import { sliderData, getAvailableProductData, getUnavailableProductData} from '../data/products.js';

const HomeScreen = ({navigation}) => {
  const {userInfo} = useContext(AuthContext);
  const [productsTab, setproductsTab] = useState(1);
  const [availableViands, setAvailableViands] = useState([]);
  const [unavailableViands, setUnavailableViands] = useState([]);

  const renderBanner = ({item, index}) => {
    return <BannerSlider data={item} />;
  };

  const onSelectSwitch = value => {
    setproductsTab(value);
  };

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      const availableViands = await getAvailableProductData();
      setAvailableViands(availableViands);
    };

    fetchAvailableProducts();
  }, []);

  useEffect(() => {
    const fetchUnavailableProducts = async () => {
      const unavailableViands = await getUnavailableProductData();
      setUnavailableViands(unavailableViands);
    };

    fetchUnavailableProducts();
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{paddingHorizontal: 20, paddingTop: 0}}>
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
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <ImageBackground
              source={require('../assets/images/misc/favorite.png')}
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
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
          <Text style={{fontSize: 17}}>
            Upcoming Viands
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{color: '#0aada8', fontSize: 17}}>See all</Text>
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

        <View style={{marginVertical: 20}}>
          <CustomSwitch
            selectionMode={1}
            option1="Popular"
            option2="Free Delivery"
            onSelectSwitch={onSelectSwitch}
          />
        </View>

        {productsTab === 1 &&
          availableViands.map(item => (
            <ListItem
              photo={require('../assets/images/misc/username.png')}
              key={item.id}
              title={item.name}
              subTitle={item.description}
              isAvailable={item.isAvailable}
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
          ))}
       {productsTab === 2 &&
          unavailableViands.map(item => (
            <ListItem
              photo={require('../assets/images/misc/username.png')}
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
                })
              }
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;