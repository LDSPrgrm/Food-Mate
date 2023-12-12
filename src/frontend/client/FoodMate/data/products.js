import axios from 'axios';

async function getProductData() {
    try {
        const response = await axios.get('http://192.168.109.155/Projects/E-Commerce/src/backend/api/php/client/get_products.php');
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
            status_id: product.status_id,
            // image: `./assets/images/genshin-impact.jpeg`,
        }));
    } catch (error) {
        console.error('Error in getSliderData:', error);
        return [];
    }
}

async function getAvailableProductData() {
    const productData = await getProductData();

    return productData
        .filter(product => product.status_id == 1)
        .map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: `$${product.price}`,
            stock: product.stock,
            status_id: product.status_id,
            isAvailable: 'Yes',
        }));
}

async function getUnavailableProductData() {
    const productData = await getProductData();

    return productData
        .filter(product => product.status_id == 2)
        .map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            price: `₱ ${product.price}`,
            stock: product.stock,
            status_id: product.status_id,
            isAvailable: 'No',
        }));
}

export const sliderData = getSliderData;
export { getAvailableProductData, getUnavailableProductData };
