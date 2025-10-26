import React from 'react';
import { AffiliateProduct } from '../types';
import TagIcon from './icons/TagIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface AffiliateProductCardProps {
    product: AffiliateProduct;
}

const AffiliateProductCard: React.FC<AffiliateProductCardProps> = ({ product }) => {
    return (
        <a
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white rounded-xl overflow-hidden shadow-md border border-border-color hover:shadow-xl hover:border-primary/50 transition-all duration-300"
            aria-label={`Shop for ${product.name}`}
        >
            <div className="relative aspect-square overflow-hidden">
                <img
                    alt={product.name}
                    src={product.imageUrl}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                />
            </div>
            <div className="p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-text-secondary">
                    <TagIcon className="w-4 h-4" />
                    <span className="uppercase tracking-wider">{product.brand}</span>
                </div>
                <h3 className="mt-1 text-md font-bold text-text-primary leading-tight h-12 line-clamp-2" title={product.name}>
                    {product.name}
                </h3>
                <div className="mt-2 pt-2 border-t border-border-color flex justify-between items-center">
                    <p className="text-lg font-bold text-primary">
                        ${product.price.toFixed(2)}
                    </p>
                    <button
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                        aria-hidden="true"
                    >
                        <span>Shop Now</span>
                        <ExternalLinkIcon className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </a>
    );
};

export default AffiliateProductCard;
