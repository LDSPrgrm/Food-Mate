import React from 'react'
import { View, Text } from 'react-native'

const ViandDetailsScreen = ({navigation, route}) => {
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text>Game Details Screen</Text>
      <Text>{route.params?.name}</Text>
    </View>
  )
}

export default ViandDetailsScreen