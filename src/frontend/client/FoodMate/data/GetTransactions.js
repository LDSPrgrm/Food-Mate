import axios from 'axios';

async function getTransactionCount() {
    try {
        const response = await axios.get('http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/get_user_transactions.php');
        console.log(response.data.transaction_count);
        return response.data.transaction_count;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return 0;
    }
}

export {getTransactionCount}