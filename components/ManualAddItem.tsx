import React, { useState } from 'react';
import PlusIcon from './icons/PlusIcon';

interface ManualAddItemProps {
    onAddItem: (item: string) => Promise<void>;
    isLoading: boolean;
}

const ManualAddItem: React.FC<ManualAddItemProps> = ({ onAddItem, isLoading }) => {
    const [newItem, setNewItem] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedItem = newItem.trim();
        if (trimmedItem) {
            await onAddItem(trimmedItem);
            setNewItem('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm border border-border-color h-full">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="e.g., olive oil, bread, milk"
                    className="flex-grow p-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
                    disabled={isLoading}
                    aria-label="Add a new item to the shopping list"
                />
                <button
                    type="submit"
                    disabled={isLoading || !newItem.trim()}
                    className="bg-primary text-white p-2 rounded-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-wait"
                    aria-label="Add item to list"
                >
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    ) : (
                        <PlusIcon className="h-6 w-6" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default ManualAddItem;
