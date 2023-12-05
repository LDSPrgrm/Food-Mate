import axios from 'axios';

// Function to fetch product data from the server
async function getProductData() {
    try {
        const response = await axios.get('src/backend/api/php/client/get_products.php');
        return response.data;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
}

// Function to format product data for sliders
async function getSliderData() {
    const productData = await getProductData();
    return productData.map(product => ({
        title: product.name,
        image: `path/to/images/${product.id}.jpeg`, // Adjust the image path as needed
    }));
}

// Function to format product data for free games
async function getAvailableProductData() {
    const productData = await getProductData();
    return productData.map(product => ({
        poster: `src/frontend/client/FoodMate/assets/images/ v/${product.name}.jpg`, // Adjust the image path as needed
        title: product.name,
        description: product.description,
        isAvailable: 'Yes',
        price: `$${product.price.toFixed(2)}`,
        id: product.id.toString(),
    }));
}

// Function to format product data for paid games
async function getUnvailableProductData() {
    const productData = await getProductData();
    return productData.map(product => ({
        poster: `src/frontend/client/FoodMate/assets/images/unavailable/${product.name}.jpg`, // Adjust the image path as needed
        title: product.name,
        description: product.description,
        isAvailable: 'No',
        price: `$${product.price.toFixed(2)}`,
        id: product.id.toString(),
    }));
}

// Export the formatted data
export const sliderData = await getSliderData();
export const freeDelivery = await getAvailableProductData();
export const paidDelivery = await getUnvailableProductData();
