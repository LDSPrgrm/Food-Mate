import axios from 'axios';

function addOrder(user_id, product_id, quantity) {
    const products = [
        { product_id: product_id, quantity: quantity },
      ];
    try {
        axios.post(
            'http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/insert_order.php',
            { 
              user_id: user_id,
              products: products,
            },
            { 
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => {
                console.log(response.data);
            })
            .catch($e => {
                console.error($e);
            })
    } catch (error) {
        console.error('Error posting product data:', error);
    }
}

export { addOrder };