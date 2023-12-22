import axios from 'axios';

async function getTransactionCount(username) {
    try {
        const response = await axios.post(
            'http://192.168.108.88/Projects/E-Commerce/src/backend/api/php/client/get_user_transactions.php',
            {
                username: username,
            }
        );
        return response.data.transaction_count;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return 0;
    }
}

export {getTransactionCount}