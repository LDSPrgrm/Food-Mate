import axios from 'axios';
const addToCart = async (user_id, product_id, quantity) => {
  try {
    const response = await axios.post(
      'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/add_to_cart.php',
      {
        user_id: user_id,
        product_id: product_id,
        quantity: quantity,
      }
    );
  } catch (error) {
    console.error('Error adding to cart:', error);
  }
};

async function updateCartDetails(user_id, product_id, quantity, subtotal) {
    try {
        axios.post(
            'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/update_cart_details.php',
            { 
              user_id: user_id,
              product_id: product_id,
              quantity: quantity,
              subtotal: subtotal,
            },
            { 
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => {
            })
            .catch($e => {
                console.error($e);
            })
    } catch (error) {
        console.error('Error posting product data:', error);
    }
}

function deleteFromCart(user_id, product_id) {
    try {
        axios.post(
            'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/remove_from_cart.php',
            { 
              user_id: user_id,
              product_id: product_id,
            },
            { 
                headers: { 'Content-Type': 'application/json' } 
            })
            .then(response => {
            })
            .catch($e => {
                console.error($e);
            })
    } catch (error) {
        console.error('Error posting user and product data:', error);
    }
}

async function getCartCount(username) {
    try {
        const response = await axios.post(
            'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/get_user_cart_count.php', 
            {
                username: username,
            }
        );
        return response.data.cart_count;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return 0;
    }
}

async function getCartDetails(user_id) {
    try {
        const response = await axios.post(
            'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/get_user_cart_details.php',
            {
                user_id: user_id,
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return 0;
    }
}

async function recharge(user_id, balance) {
  try {
      const response = await axios.post(
          'http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/add_balance.php',
          {
            user_id: user_id,
            balance: balance,
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error fetching product data:', error);
      return 0;
  }
}


export { getCartCount, getCartDetails, updateCartDetails, deleteFromCart, addToCart, recharge }
