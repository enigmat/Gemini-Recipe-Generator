import React from 'react';
import { Product } from '../types';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col group border">
            <div className="relative">
                <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{product.brand}</p>
                <h3 className="text-lg font-semibold text-gray-800 truncate mt-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-3 flex-grow">{product.description}</p>
                <a
                    href={product.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors text-sm"
                >
                    <span>Shop Now</span>
                    <ExternalLinkIcon className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export default ProductCard;