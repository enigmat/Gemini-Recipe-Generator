import React from 'react';
import { CartItem } from '../types';
import ShoppingCartIcon from './icons/ShoppingCartIcon';
import TrashIcon from './icons/TrashIcon';

interface ShoppingCartProps {
    cart: CartItem[];
    onUpdateQuantity: (productName: string, newQuantity: number) => void;
    onRemove: (productName: string) => void;
    onCheckout: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ cart, onUpdateQuantity, onRemove, onCheckout }) => {
    const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-border-color">
            <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                <ShoppingCartIcon className="w-6 h-6" />
                Shopping Cart
            </h2>
            {cart.length === 0 ? (
                <p className="text-text-secondary">Your cart is empty.</p>
            ) : (
                <>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {cart.map(({ product, quantity }) => (
                            <div key={product.name} className="flex items-center gap-4 border-b pb-4 last:border-b-0">
                                <img src={product.imageUrl} alt={product.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-text-primary">{product.name}</p>
                                    <p className="text-sm text-text-secondary">${product.price.toFixed(2)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => onUpdateQuantity(product.name, parseInt(e.target.value, 10))}
                                        className="w-16 p-1 border border-border-color rounded-md text-center"
                                        aria-label={`Quantity for ${product.name}`}
                                    />
                                    <button onClick={() => onRemove(product.name)} className="p-1 text-red-500 hover:text-red-700">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-border-color">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total:</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={onCheckout}
                            className="mt-4 w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus transition-colors"
                        >
                            Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ShoppingCart;
