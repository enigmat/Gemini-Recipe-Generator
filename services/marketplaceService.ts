import { Product } from '../types';
import * as imageStore from './imageStore';
// FIX: saveDatabase removed, use granular async savers.
import { getDatabase, saveProducts as saveProductsToCloud } from './cloudService';

// FIX: make async
export const getProducts = async (): Promise<Product[]> => {
    // FIX: await promise
    const db = await getDatabase();
    return db.products;
};

// FIX: make async and use specific saver from cloudService
export const saveProducts = async (products: Product[]): Promise<void> => {
    await saveProductsToCloud(products);
};

// FIX: make async
export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const products = await getProducts();
    const newProduct: Product = { ...product, id: `prod${Date.now()}` };
    await saveProducts([newProduct, ...products]);
    return newProduct;
};

// FIX: make async
export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    const products = await getProducts();
    const updatedProducts = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    await saveProducts(updatedProducts);
    return updatedProduct;
};

// FIX: make async
export const deleteProduct = async (productId: string): Promise<Product[]> => {
    const products = await getProducts();
    const productToDelete = products.find(p => p.id === productId);
    const updatedProducts = products.filter(p => p.id !== productId);
    await saveProducts(updatedProducts);

    // Also delete the image from IndexedDB if it's stored there
    if (productToDelete && productToDelete.imageUrl.startsWith('indexeddb:')) {
        await imageStore.deleteImage(productId);
    }
    return updatedProducts;
};