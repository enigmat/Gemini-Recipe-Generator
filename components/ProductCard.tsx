import React from 'react';
import { Product } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface ProductCardProps {
    product: Product;
    onAddToCart: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <div className="group bg-white rounded-xl overflow-hidden shadow-md border border-border-color flex flex-col">
            <div className="relative aspect-square overflow-hidden">
                <img
                    alt={product.name}
                    src={product.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-md font-bold text-text-primary leading-tight h-12 line-clamp-2" title={product.name}>
                    {product.name}
                </h3>
                <p className="mt-1 text-sm text-text-secondary line-clamp-3 flex-grow">
                    {product.description}
                </p>
                <div className="mt-4 pt-4 border-t border-border-color flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                    </p>
                    <button
                        onClick={onAddToCart}
                        className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        aria-label={`Add ${product.name} to cart`}
                    >
                        <ShoppingCartIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
