import { Product } from '../types';
import * as imageStore from './imageStore';
import { getSupabaseClient } from './supabaseClient';

const mapProductFromDb = (dbProduct: any): Product => {
    const { image_url, affiliate_url, ...rest } = dbProduct;
    return { ...rest, imageUrl: image_url, affiliateUrl: affiliate_url };
};

const mapProductToDb = (product: Product) => {
    const { imageUrl, affiliateUrl, ...rest } = product;
    return { ...rest, image_url: imageUrl, affiliate_url: affiliateUrl };
};

export const getProducts = async (): Promise<Product[]> => {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data.map(mapProductFromDb);
};

export const saveProducts = async (products: Product[]): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('products').upsert(products.map(mapProductToDb));
    if (error) throw error;
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    const supabase = getSupabaseClient();
    const newProduct = { ...product, id: `prod${Date.now()}` };
    const { error } = await supabase.from('products').insert(mapProductToDb(newProduct));
    if (error) throw error;
    return newProduct;
};

export const updateProduct = async (updatedProduct: Product): Promise<Product> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('products').update(mapProductToDb(updatedProduct)).eq('id', updatedProduct.id);
    if (error) throw error;
    return updatedProduct;
};

export const deleteProduct = async (productId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) throw error;
};