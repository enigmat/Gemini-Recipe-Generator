import { Product } from '../types';
import * as imageStore from './imageStore';
import { getDatabase, saveDatabase } from './cloudService';

export const getProducts = (): Product[] => {
    const db = getDatabase();
    return db.products;
};

export const saveProducts = (products: Product[]): void => {
    const db = getDatabase();
    db.products = products;
    saveDatabase(db);
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

export const deleteProduct = async (productId: string): Promise<Product[]> => {
    const products = getProducts();
    const productToDelete = products.find(p => p.id === productId);
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);

    // Also delete the image from IndexedDB if it's stored there
    if (productToDelete && productToDelete.imageUrl.startsWith('indexeddb:')) {
        await imageStore.deleteImage(productId);
    }
    return updatedProducts;
};