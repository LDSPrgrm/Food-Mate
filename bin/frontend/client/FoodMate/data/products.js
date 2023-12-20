import axios from 'axios';

async function getProductData() {
    try {
        const response = await axios.get('http://192.168.100.142/Projects/E-Commerce/src/backend/api/php/client/get_products.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
}

async function getSliderData() {
    try {
        const productData = await getProductData();

        return productData.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
            total_sales_quantity: product.total_sales_quantity,
            total_sales_amount: product.total_sales_amount,
            status_id: product.status_id,
            // image: require('../assets/images/products/adobo.jpg'),
        }));
    } catch (error) {
        console.error('Error in getSliderData:', error);
        return [];
    }
}

async function getAvailableProductData() {
    const productData = await getProductData();

    return productData
        .filter(product => product.total_sales_quantity >= 50 && product.status_id == 1)
        .map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: `₱ ${product.price}`,
            stock: product.stock,
            total_sales_quantity: product.total_sales_quantity,
            total_sales_amount: product.total_sales_amount,
            status_id: product.status_id,
        }));
}

async function getUnavailableProductData() {
    const productData = await getProductData();

    return productData
        .filter(product => product.total_sales_quantity < 50 && product.status_id == 1)
        .map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: `₱ ${product.price}`,
            stock: product.stock,
            total_sales_quantity: product.total_sales_quantity,
            total_sales_amount: product.total_sales_amount,
            status_id: product.status_id,
        }));
}

export const sliderData = getSliderData();
export { getAvailableProductData, getUnavailableProductData };
