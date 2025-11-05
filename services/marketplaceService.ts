import { Product } from '../types';
import * as imageStore from './imageStore';
import { getDatabase, updateDatabase } from './database';

export const getProducts = (): Product[] => {
    return getDatabase().products;
};

export const saveProducts = (products: Product[]): void => {
    updateDatabase(db => {
        db.products = products;
    });
};

export const addProduct = (product: Omit<Product, 'id'>): Product => {
    const newProduct: Product = { ...product, id: `prod${Date.now()}` };
    updateDatabase(db => {
        db.products.unshift(newProduct);
    });
    return newProduct;
};

export const updateProduct = (updatedProduct: Product): Product => {
    updateDatabase(db => {
        const index = db.products.findIndex(p => p.id === updatedProduct.id);
        if (index > -1) {
            db.products[index] = updatedProduct;
        }
    });
    return updatedProduct;
};

export const deleteProduct = (productId: string): Product[] => {
    let updatedProducts: Product[] = [];
    updateDatabase(db => {
        const productToDelete = db.products.find(p => p.id === productId);
        if (productToDelete && productToDelete.imageUrl.startsWith('indexeddb:')) {
            imageStore.deleteImage(productId);
        }
        db.products = db.products.filter(p => p.id !== productId);
        updatedProducts = db.products;
    });
    return updatedProducts;
};