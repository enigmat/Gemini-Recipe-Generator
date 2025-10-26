import React from 'react';
import { Product, CartItem } from '../types';
import MarketplaceSearch from './MarketplaceSearch';
import ShoppingCart from './ShoppingCart';
import ProductCard from './ProductCard';
import Spinner from './Spinner';
import StoreIcon from './icons/StoreIcon';

interface MarketplaceProps {
    products: Product[];
    cart: CartItem[];
    isLoading: boolean;
    error: string | null;
    onSearch: (prompt: string) => void;
    onAddToCart: (product: Product) => void;
    onUpdateCartQuantity: (productName: string, newQuantity: number) => void;
    onRemoveFromCart: (productName: string) => void;
    onCheckout: () => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({
    products, cart, isLoading, error, onSearch, onAddToCart,
    onUpdateCartQuantity, onRemoveFromCart, onCheckout
}) => {
    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-3 text-primary">
                    <StoreIcon className="w-10 h-10" />
                    <h1 className="text-4xl font-bold">AI Marketplace</h1>
                </div>
                <p className="mt-2 text-lg text-text-secondary max-w-2xl mx-auto">
                    Looking for something specific? Describe any kitchen item, ingredient, or gadget, and let our AI find it for you.
                </p>
            </div>

            <div className="mb-8">
                <MarketplaceSearch onSearch={onSearch} isLoading={isLoading} />
                {error && <p className="mt-4 text-center text-red-600">{error}</p>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <Spinner />
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {products.map(product => (
                                <ProductCard
                                    key={product.name}
                                    product={product}
                                    onAddToCart={() => onAddToCart(product)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-dashed">
                            <p className="text-lg text-text-secondary">
                                Search for products to get started.
                            </p>
                            <p className="text-sm">e.g., "high quality non-stick pan" or "spices for thai curry"</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 lg:sticky lg:top-8">
                    <ShoppingCart
                        cart={cart}
                        onUpdateQuantity={onUpdateCartQuantity}
                        onRemove={onRemoveFromCart}
                        onCheckout={onCheckout}
                    />
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
