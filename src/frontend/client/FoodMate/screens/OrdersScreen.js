import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
import { AuthContext } from '../context/AuthContext';

const OrdersScreen = () => {
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { userInfo } = useContext(AuthContext);

  const onRefresh = () => {
    setIsRefreshing(true);

    const requestData = {
      user_id: userInfo.user_id,
    };

    fetch('http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/get_past_transactions.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => response.json())
      .then(data => {
        setTransactionCount(data.transaction_count);
        setTransactions(data.transactions);
      })
      .catch(error => console.error('Error fetching transactions:', error))
      .finally(() => {
        setIsRefreshing(false);
      });
  };

  useEffect(() => {
    onRefresh();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.headerText}>Past Orders</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
      >
        {transactions.map((transaction, index) => (
          <View key={index} style={styles.transactionContainer}>
            <Text style={styles.orderDate}>{`Order Date: ${transaction.order_date}`}</Text>
            <Table borderStyle={{ borderWidth: 1, borderColor: '#ddd' }}>
              <Row
                data={['Product', 'Price', 'Quantity', 'Subtotal']}
                style={styles.tableHeader}
                textStyle={styles.tableHeaderText}
              />
              <Rows
                data={transaction.orders.map(order => [
                  order.name,
                  `₱ ${order.price}`,
                  order.quantity,
                  `₱ ${order.subtotal}`,
                ])}
                textStyle={styles.tableText}
              />
            </Table>
            <Text style={styles.totalPriceText}>{`Total Price: ₱ ${calculateTotalPrice(transaction.orders)}`}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const calculateTotalPrice = orders => {
  return orders.reduce((total, order) => total + parseFloat(order.subtotal), 0).toFixed(2);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    marginVertical: 10,
  },
  transactionContainer: {
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
  },
  orderDate: {
    fontSize: 17,
    fontWeight: 'bold',
    margin: 10,
    textAlign: 'center',
  },
  tableHeader: {
    height: 40,
    backgroundColor: '#3EB075',
  },
  tableHeaderText: {
    margin: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  tableText: {
    margin: 6,
  },
  tableTextLeft: {
    textAlign: 'left',
  },
  tableTextRight: {
    textAlign: 'right',
  },
  totalPriceText: {
    color: '#3EB075',
    fontWeight: 'bold',
    margin: 10,
    alignSelf: 'flex-end',
  },
});

export default OrdersScreen;
