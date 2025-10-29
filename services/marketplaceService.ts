import { Product } from '../types';
import { affiliateProducts as initialProducts } from '../data/affiliateProducts';
import * as imageStore from './imageStore';

const PRODUCTS_KEY = 'recipeAppMarketplaceProducts';

// Initialize with default products if none exist
if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
}

export const getProducts = (): Product[] => {
    try {
        const productsJson = localStorage.getItem(PRODUCTS_KEY);
        return productsJson ? JSON.parse(productsJson) : [];
    } catch (error) {
        console.error('Could not get products from localStorage', error);
        return [];
    }
};

export const saveProducts = (products: Product[]): void => {
    try {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
        console.error('Could not save products to localStorage', error);
    }
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
    const products = getProducts();
    const newProduct: Product = { ...product, id: `prod${Date.now()}` };
    saveProducts([newProduct, ...products]);
    return newProduct;
};

export const updateProduct = (updatedProduct: Product): Product => {
    const products = getProducts();
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    saveProducts(updatedProducts);
    return updatedProduct;
};

export const deleteProduct = (productId: string): void => {
    const products = getProducts();
    const productToDelete = products.find(p => p.id === productId);
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);

    // Also delete the image from IndexedDB if it's stored there
    if (productToDelete && productToDelete.imageUrl.startsWith('indexeddb:')) {
        imageStore.deleteImage(productId);
    }
};
