import React from 'react';
import { AffiliateProduct } from '../types';
import AffiliateProductCard from './AffiliateProductCard';
import ShoppingCartIcon from './icons/ShoppingCartIcon';

interface AffiliateShowcaseProps {
    products: AffiliateProduct[];
}

const AffiliateShowcase: React.FC<AffiliateShowcaseProps> = ({ products }) => {
    if (products.length === 0) {
        return null;
    }

    return (
        <div className="my-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6 text-primary" />
                Shop Our Favorites
            </h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4">
                {products.map(product => (
                     <div key={product.name} className="flex-shrink-0 w-72">
                         <AffiliateProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AffiliateShowcase;
