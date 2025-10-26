import React from 'react';
import { ShoppingList } from '../types';
import XIcon from './icons/XIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';

interface ShoppingListModalProps {
    shoppingList: ShoppingList | null;
    error: string | null;
    recipeTitle: string;
    onClose: () => void;
    onShopOnInstacart: () => void;
}

const ShoppingListModal: React.FC<ShoppingListModalProps> = ({ shoppingList, error, recipeTitle, onClose, onShopOnInstacart }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="shopping-list-modal-title"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <h2 id="shopping-list-modal-title" className="text-2xl font-bold text-text-primary">
                        Shopping List
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                        aria-label="Close shopping list"
                    >
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {error ? (
                        <div className="text-center text-red-500 bg-red-50 p-4 rounded-lg">
                            <p className="font-semibold">Could not generate list</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : shoppingList && shoppingList.length > 0 ? (
                        <>
                            <p className="text-text-secondary mb-6 text-center">
                                A categorized shopping list for <strong className="text-primary">{recipeTitle}</strong>.
                            </p>
                            <div className="space-y-6">
                                {shoppingList.map(({ category, items }) => (
                                    <div key={category}>
                                        <h3 className="text-lg font-semibold text-primary mb-2 border-b-2 border-primary/20 pb-1">
                                            {category}
                                        </h3>
                                        <ul className="space-y-2">
                                            {items.map((item, index) => (
                                                <li key={index} className="flex items-center">
                                                    <input
                                                        id={`modal-item-${category}-${index}`}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mr-3"
                                                    />
                                                    <label htmlFor={`modal-item-${category}-${index}`} className="text-text-secondary">
                                                        {item.quantity && <span className="font-semibold text-text-primary">{item.quantity}</span>} {item.name}
                                                    </label>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                         <div className="text-center text-text-secondary py-8">
                            <p>No items were found for the shopping list.</p>
                        </div>
                    )}
                </div>

                {shoppingList && shoppingList.length > 0 && !error && (
                    <div className="p-4 bg-gray-50 border-t border-border-color flex justify-end">
                        <button
                            onClick={onShopOnInstacart}
                            className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors flex items-center gap-2 text-sm"
                        >
                            <ExternalLinkIcon className="w-4 h-4"/>
                            Shop on Instacart
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingListModal;