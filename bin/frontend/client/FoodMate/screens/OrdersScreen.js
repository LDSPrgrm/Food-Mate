import React from 'react'
import { View, Text, ScrollView } from 'react-native'

const OrdersScreen = () => {
  return (
    <View style={{flex:1}}>
      <View>
        <Text 
          style={{
            alignSelf: 'center',
            fontSize: 18,
            fontWeight: 700,
            marginTop: 10,

          }}>Past Transactions</Text>
      </View>

      <ScrollView style={{
        margin: 20
      }}>
        <View style={{marginVertical: 10}}>
          <Text>Product:</Text>
        </View>
      </ScrollView>

    </View>
  )
}

export default OrdersScreen