import React, {useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

import BannerSlider from '../components/BannerSlider';
import CustomSwitch from '../components/CustomSwitch';
import ListItem from '../components/ListItem';
import {windowWidth} from '../utils/Dimensions';

import {freeDelivery, paidDelivery, sliderData} from '../data/products';

export default function HomeScreen({navigation}) {
  const [gamesTab, setGamesTab] = useState(1);

  const renderBanner = ({item, index}) => {
    return <BannerSlider data={item} />;
  };

  const onSelectSwitch = value => {
    setGamesTab(value);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={{padding: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}>
          <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium'}}>
            Hello John Doe
          </Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            {/* <ImageBackground
              source={require('../assets/images/user-profile.jpg')}
              style={{width: 35, height: 35}}
              imageStyle={{borderRadius: 25}}
            /> */}
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
          <Text style={{fontSize: 18, fontFamily: 'Roboto-Medium'}}>
            Upcoming Games
          </Text>
          <TouchableOpacity onPress={() => {}}>
            <Text style={{color: '#0aada8'}}>See all</Text>
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
            option1="Free Delivery"
            option2="Paid games"
            onSelectSwitch={onSelectSwitch}
          />
        </View>

        {gamesTab == 1 &&
          availableViand.map(item => (
            <ListItem
              key={item.id}
              photo={item.poster}
              title={item.title}
              subTitle={item.description}
              isAvailable={item.isFree}
              onPress={() =>
                navigation.navigate('FoodDetails', {
                  title: item.title,
                  id: item.id,
                })
              }
            />
          ))}
        {gamesTab == 2 &&
          unvailableViand.map(item => (
            <ListItem
              key={item.id}
              photo={item.poster}
              title={item.title}
              subTitle={item.description}
              isAvailable={item.isFree}
              price={item.price}
              onPress={() =>
                navigation.navigate('FoodDetails', {
                  title: item.title,
                  id: item.id,
                })
              }
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}