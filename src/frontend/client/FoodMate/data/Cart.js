// data/Cart.js
import axios from 'axios';
const addToCart = async (user_id, product_id, quantity, price) => {
  try {
    const response = await axios.post(
      'http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/add_to_cart.php',
      {
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
        price: price,
      }
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

export { addToCart };
